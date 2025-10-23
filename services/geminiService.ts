
import { GoogleGenAI } from "@google/genai";
import { SQL_SCHEMA } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateSQLQuery = async (userPrompt: string): Promise<string> => {
  if (!API_KEY) {
    return "ERROR: Gemini API key is not configured. Please set the API_KEY environment variable.";
  }
  
  try {
    const prompt = `
      You are an expert SQL database administrator. Based on the following SQL schema, please generate a valid SQL query that answers the user's request.

      **SQL Schema:**
      ${SQL_SCHEMA}

      **User Request:**
      "${userPrompt}"

      **Instructions:**
      - ONLY output the SQL query.
      - Do not add any explanations, introductions, or markdown formatting like \`\`\`sql.
      - The query should be compatible with standard SQL. Use backticks for reserved keywords like \`ORDER\`.
      - If the request is ambiguous or cannot be answered with the given schema, return an error message starting with "ERROR:".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error('Error generating SQL query:', error);
    return 'ERROR: Failed to communicate with the Gemini API.';
  }
};

export const geminiService = {
  generateSQLQuery,
};
