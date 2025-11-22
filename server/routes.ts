import express, { type Request, type Response } from "express";
import { insertMissionSchema, MissionRecord } from "../shared/schema.js"; 
import { generateChaosMission } from "./lib/groq.js";
import { getMissionByEmail, saveMission, verifyStudentEmail } from "./lib/googleSheets.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Helper to format response (removed isPunishment)
const formatMissionResponse = (record: MissionRecord, isNew: boolean) => ({
  email: record.email,
  title: record.title,
  lore: record.lore,
  antagonist: record.antagonist,
  task: record.task,
  techStack: record.techStack,
  isNew,
});

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

    // 2. Check for existing mission history
    const lastMission = await getMissionByEmail(email);
    
    // CHECK FOR PERMANENT BAN
    if (lastMission && lastMission.status === 'rejected') {
      return res.status(403).json({
        error: "Banned",
        message: "TERMINAL LOCKOUT: You previously rejected a mission. The Chaos Architect does not offer second chances."
      });
    }
    
    // If they have an active mission, return it
    if (lastMission && lastMission.status === 'active') {
      return res.json(formatMissionResponse(lastMission, false));
    }

    // 3. Generate new mission (No retry logic needed anymore)
    const generatedMission = await generateChaosMission();

    const newMissionRecord: MissionRecord = {
      email,
      title: generatedMission.title,
      lore: generatedMission.lore,
      antagonist: generatedMission.antagonist,
      task: generatedMission.task,
      techStack: generatedMission.tech_stack,
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    await saveMission(newMissionRecord);

    return res.json(formatMissionResponse(newMissionRecord, true));

  } catch (error: any) {
    console.error("Error in /api/mission:", error);
    if (error.issues) {
      return res.status(400).json({ error: "Invalid Input", details: error.issues });
    }
    return res.status(500).json({ 
      error: "Server Error",
      message: error.message || "Failed to generate or retrieve mission" 
    });
  }
});

app.post("/api/mission/reject", async (req: Request, res: Response) => {
  try {
    const { email } = insertMissionSchema.parse(req.body);

    const isAuthorized = await verifyStudentEmail(email);
    if (!isAuthorized) return res.status(403).send("Unauthorized");

    const currentMission = await getMissionByEmail(email);

    if (!currentMission) {
      return res.status(404).json({ message: "No mission found to reject" });
    }

    // Mark as rejected - effectively banning them
    const rejectionRecord: MissionRecord = {
      ...currentMission,
      timestamp: new Date().toISOString(),
      status: 'rejected'
    };

    await saveMission(rejectionRecord);

    return res.json({ message: "Mission rejected. Connection terminated." });

  } catch (error: any) {
    console.error("Error rejecting mission:", error);
    return res.status(500).json({ message: "Failed to reject mission" });
  }
});

export { app };