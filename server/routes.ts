import express, { type Request, type Response } from "express";
import { insertMissionSchema } from "../shared/schema"; // Fixed relative path
import { generateChaosMission } from "./lib/groq";
import { getMissionByEmail, saveMission, verifyStudentEmail } from "./lib/googleSheets";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
    if (error.issues) {
      return res.status(400).json({ error: "Invalid Input", details: error.issues });
    }
    // Return JSON error instead of crashing
    return res.status(500).json({ 
      error: "Server Error",
      message: error.message || "Failed to generate or retrieve mission" 
    });
  }
});

export { app };