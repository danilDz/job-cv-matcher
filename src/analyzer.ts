import { TRPCError } from '@trpc/server';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { generateContentRequest } from './gemini.service';

export async function processAndAnalyzeFiles(jobPath: string, cvPath: string) {
  try {
    const [jobDescriptionBuffer, cvBuffer] = await Promise.all([
      fs.readFile(jobPath),
      fs.readFile(cvPath),
    ]);

    const [jobDescription, cv] = await Promise.all([
      pdfParse(jobDescriptionBuffer),
      pdfParse(cvBuffer),
    ]);

    const prompt = `
      Analyze the following job description and CV:
      - Identify the candidate's strengths and weaknesses.
      - Highlight gaps relative to the job requirements.
      - Summarize how well the CV aligns with the job description.

      Job Description:
      ${jobDescription.text}

      CV:
      ${cv.text}
    `;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }], role: 'user' }],
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `You are a detail-oriented recruiter with more than 10 years of experience in analyzing candidates' CVs.`,
          },
        ],
      },
    };

    const response = await generateContentRequest(requestBody);

    return response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
  } catch (error) {
    console.error('Error analyzing files:', error);
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Analysis failed.' });
  }
}
