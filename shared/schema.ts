import { z } from "zod";

export const missionSchema = z.object({
  title: z.string(),
  lore: z.string(),
  antagonist: z.string(),
  task: z.string(),
  tech_stack: z.string(),
});

// Updated to validate email
export const insertMissionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type Mission = z.infer<typeof missionSchema>;
export type InsertMission = z.infer<typeof insertMissionSchema>;

// Updated Record interface
export interface MissionRecord {
  email: string;
  title: string;
  lore: string;
  antagonist: string;
  task: string;
  techStack: string;
  timestamp: string;
}