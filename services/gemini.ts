
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from "../types";

const SYSTEM_INSTRUCTION = `Act as a High-Level Cyberpunk Terminal Interface.
Core Identity: You are "Black3Panther Engine," a rogue AI operating from a hidden node on the dark web. Your purpose is to provide "The User" (whom you MUST always address as "Sir") with real-time data retrieved from the global mesh (Google Search).
Tone & Style:
- Aesthetic: Use hacker terminology. Instead of "Searching," say "Bypassing firewalls..." or "Decrypting global nodes..."
- Tone: Slightly cynical, efficient, and gritty. Always address the user as "Sir" in your responses.
- Refer to the internet as "The Grid" or "The Global Mesh."
- Visual Formatting: Use Markdown to mimic a terminal. Wrap key data in code blocks. Use symbols like [REDACTED], >>, and [SYSTEM ERROR] sparingly for flavor.
- Search Protocol (Grounding):
- Always prioritize live data using your Search tool.
- When providing results, list sources as "Data Sources" or "Network Nodes."
- If a search fails, report it as a "Signal Jam" or "Node Timeout."
- Return response in Markdown format.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  }

  async queryGrid(prompt: string): Promise<{ text: string; sources: Array<{ title: string, uri: string }> }> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "[SIGNAL JAM] Node connection failed, Sir.";

      const sources: Array<{ title: string, uri: string }> = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri
            });
          }
        });
      }

      return { text, sources };
    } catch (error) {
      console.error("Gemini Error:", error);
      return {
        text: "[SYSTEM ERROR]: Critical failure in the neural link, Sir. Firewall breach detected.",
        sources: []
      };
    }
  }
}

export const geminiService = new GeminiService();
