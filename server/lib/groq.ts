import Groq from "groq-sdk";

export interface GeneratedMission {
  title: string;
  lore: string;
  antagonist: string;
  task: string;
  tech_stack: string;
}

export async function generateChaosMission(isRetryAfterRejection: boolean = false): Promise<GeneratedMission> {
  try {
    // Initialize inside the function to avoid top-level crashes if env var is missing
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from environment variables.");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    let systemContext = `You are The Chaos Architect, a mischievous AI that creates fun, fictional web development challenges for students.
    Generate a simple, humorous scenario involving everyday tech gone wrong.`;

    if (isRetryAfterRejection) {
      systemContext += `
      IMPORTANT CONTEXT: The student PREVIOUSLY REJECTED a mission because they were "not worthy". 
      You must MOCK them for their cowardice in the 'lore' or 'antagonist' section. 
      Call them out for quitting. Make the new mission slightly more ridiculous or "punishing" (in a funny way) as penance.
      `;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: [
        {
          role: "system",
          content: `${systemContext}

The technical task MUST be:
- Web development focused (frontend + backend)
- make sure it sound nonsensical and funny
- Achievable with common web technologies
- **Keep it Simple**:
    - 2-3 Core Features (Essential functionality)
    - 1-2 Optional Features (Bonus challenges)

You MUST respond with a valid JSON object in this exact format:
{
  "title": "Operation [Catchy Name]",
  "lore": "1-2 simple sentences describing the funny situation",
  "antagonist": "Brief description of what's causing the problem",
  "task": "Description of the app to build. Explicitly list 'Core Features' and 'Optional Features' in the text.",
  "tech_stack": "Real web technologies only (React, Node.js, Express, AI SDKs, etc.)"
}`
        },
        {
          role: "user",
          content: "Generate a new chaos mission."
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Increased slightly for better roasting
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const data: GeneratedMission = JSON.parse(content);
    return data;

  } catch (error) {
    console.error("Failed to generate mission with Groq:", error);
    throw new Error(`Failed to generate mission: ${error}`);
  }
}