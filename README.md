# Job Description and CV Matcher

## Overview

This project provides a **Node.js server** powered by **tRPC** to analyze two PDF files (a job description and a CV) using AI. The AI identifies strengths, weaknesses, and alignment between the candidate's CV and the job description.

---

## Features

- **Single API Endpoint**: `/trpc/analyze` to upload and analyze PDF files.
- **AI-Powered Analysis**: Uses Gemini 1.5 Flash model for generating insights.

---

## Prerequisites

Ensure you have the following installed and setup:

- **Node.js**: Version 22 or higher.
- **npm**: Version 10.9.2 or higher.
- **Gemini API Key**: Required for AI analysis.
- **Gemini API URL**: Required for AI analysis.

---

## Setup Instructions

### 1. Clone the repository
``` bash
git clone https://github.com/danilDz/job-cv-matcher.git
cd job-cv-matcher
```

### 2. Install dependencies
``` bash
npm ci
```

### 3. Set up environment variables
``` javascript
GEMINI_API_URL=your_gemini_api_url
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the server
``` bash
npm run start:dev
```

---

## Usage Instructions (via Postman)

### 1. Create a new POST request with the following URL: `http://localhost:4000/trpc/analyze`

### 2. Add Body to the created POST request. Type - `form-data`, and add two PDF files: `jobDescription` and `cv`

### 3. Send the request and wait for the answer

---

## License

See the [LICENSE](./LICENSE.txt) file for licensing information.