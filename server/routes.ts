import express, { type Request, type Response } from "express";
// FIX: Use relative path instead of alias
import { insertMissionSchema } from "../shared/schema";
import { generateChaosMission } from "./lib/groq";
import { getMissionByEmail, saveMission, verifyStudentEmail } from "./lib/googleSheets";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// API Routes
app.post("/api/mission", async (req: Request, res: Response) => {
  try {
    const { email } = insertMissionSchema.parse(req.body);

    // 1. Verify Email Authorization
    const isAuthorized = await verifyStudentEmail(email);
    
    if (!isAuthorized) {
      return res.status(403).json({ 
        error: "Access Denied",
        message: "This email is not registered in the student list."
      });
    }

    // 2. Check for existing mission
    const existingMission = await getMissionByEmail(email);
    
    if (existingMission) {
      return res.json({
        email: existingMission.email,
        title: existingMission.title,
        lore: existingMission.lore,
        antagonist: existingMission.antagonist,
        task: existingMission.task,
        techStack: existingMission.techStack,
      });
    }

    // 3. Generate new mission
    const generatedMission = await generateChaosMission();

    const missionRecord = {
      email,
      title: generatedMission.title,
      lore: generatedMission.lore,
      antagonist: generatedMission.antagonist,
      task: generatedMission.task,
      techStack: generatedMission.tech_stack,
      timestamp: new Date().toISOString(),
    };

    await saveMission(missionRecord);

    return res.json({
      email: missionRecord.email,
      title: missionRecord.title,
      lore: missionRecord.lore,
      antagonist: missionRecord.antagonist,
      task: missionRecord.task,
      techStack: missionRecord.techStack,
    });

  } catch (error: any) {
    console.error("Error in /api/mission:", error);
    // Handle Zod validation errors specifically
    if (error.issues) {
      return res.status(400).json({ error: "Invalid Input", details: error.issues });
    }
    return res.status(500).json({ 
      error: "Failed to generate or retrieve mission",
      details: error.message 
    });
  }
});

export { app };