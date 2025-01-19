import { TRPCError } from '@trpc/server';
import dotenv from 'dotenv';
dotenv.config();

const { GEMINI_API_KEY, GEMINI_API_URL } = process.env;

if (!GEMINI_API_KEY || !GEMINI_API_URL) {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'GEMINI_API_KEY and GEMINI_API_URL must be set in the environment.',
  });
}

export async function generateContentRequest(body: object) {
  const response = await fetch(GEMINI_API_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: GEMINI_API_KEY! },
    body: JSON.stringify(body),
  });
  return await response.json();
}
