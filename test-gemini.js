import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ NO API KEY FOUND in .env");
  process.exit(1);
}

console.log(`🔑 Using API Key: ${apiKey.substring(0, 5)}...`);

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    console.log("📡 Connecting to Google AI...");
    // 1. List available models
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Successfully initialized model object.");

    console.log("📝 Attempting to generate content...");
    const result = await modelResponse.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("🤖 Response from AI:", response.text());
    
  } catch (error) {
    console.error("\n❌ ERROR FAILED:");
    console.error(error.message);
    
    if (error.message.includes("404")) {
      console.log("\n💡 DIAGNOSIS: 404 means the API Key is valid, but the 'Generative Language API' is NOT enabled for the project this key belongs to.");
    }
  }
}

test();