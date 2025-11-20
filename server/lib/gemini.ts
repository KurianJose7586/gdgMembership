import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is missing from environment variables.");
}

// Initialize the stable SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface GeneratedMission {
  title: string;
  lore: string;
  antagonist: string;
  task: string;
  tech_stack: string;
}

export async function generateChaosMission(): Promise<GeneratedMission> {
  try {
    // Use the standard 1.5 flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-001"
    });

    const systemPrompt = `You are The Chaos Architect, a mischievous AI that creates fun, fictional web development challenges for students.

Generate a simple, humorous scenario involving everyday tech gone wrong.

The technical task MUST be:
- Web development focused (frontend + backend)
- Achievable with common web technologies
- **Keep it Simple**:
    - 2-3 Core Features (Essential functionality)
    - 1-2 Optional Features (Bonus challenges)

Respond with JSON in this exact format:
{
  "title": "Operation [Catchy Name]",
  "lore": "1-2 simple sentences describing the funny situation",
  "antagonist": "Brief description of what's causing the problem",
  "task": "Description of the app to build. Explicitly list 'Core Features' and 'Optional Features' in the text.",
  "tech_stack": "Real web technologies only (React, Node.js, Express, AI SDKs, etc.)"
}`;

    const result = await model.generateContent([
        { text: systemPrompt },
        { text: "Generate a new chaos mission." }
    ]);
    
    const response = await result.response;
    const text = response.text();

    // Clean up the response in case it includes markdown backticks
    const cleanJson = text.replace(/```json\n|\n```|```/g, "").trim();

    if (cleanJson) {
      const data: GeneratedMission = JSON.parse(cleanJson);
      return data;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Failed to generate mission:", error);
    throw new Error(`Failed to generate mission: ${error}`);
  }
}