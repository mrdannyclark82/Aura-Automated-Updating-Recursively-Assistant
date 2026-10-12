import { GoogleGenAI } from "@google/genai";

// Note: API_KEY is obtained from environment variables as required by the coding guidelines.
// This singleton instance is exported to be used across the application.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
