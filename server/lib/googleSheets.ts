import { google } from 'googleapis';
import { MissionRecord } from '@shared/schema';

// Standard Authentication (Local/Production)
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

const SPREADSHEET_NAME = 'Chaos Architect Missions';
const SHEET_NAME = 'Missions';
const STUDENTS_LIST_SHEET_NAME = 'Students List';
const STUDENTS_LIST_TAB_NAME = 'list';

let cachedSpreadsheetId: string | null = null;
let cachedStudentListId: string | null = null;

// Helper to find a spreadsheet ID by name
async function findSpreadsheetId(name: string): Promise<string | null> {
  const response = await drive.files.list({
    q: `name='${name}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
    fields: 'files(id, name)',
  });
  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!;
  }
  return null;
}

async function ensureMissionSpreadsheetExists() {
  if (cachedSpreadsheetId) return cachedSpreadsheetId;

  const existingId = await findSpreadsheetId(SPREADSHEET_NAME);
  if (existingId) {
    cachedSpreadsheetId = existingId;
    return cachedSpreadsheetId;
  }

  // Create if it doesn't exist
  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SPREADSHEET_NAME },
      sheets: [{
        properties: { title: SHEET_NAME },
        data: [{
          rowData: [{
            values: [
              { userEnteredValue: { stringValue: 'Email' } }, // Header updated
              { userEnteredValue: { stringValue: 'Title' } },
              { userEnteredValue: { stringValue: 'Lore' } },
              { userEnteredValue: { stringValue: 'Antagonist' } },
              { userEnteredValue: { stringValue: 'Task' } },
              { userEnteredValue: { stringValue: 'Tech Stack' } },
              { userEnteredValue: { stringValue: 'Timestamp' } },
            ]
          }]
        }]
      }]
    }
  });

  cachedSpreadsheetId = createResponse.data.spreadsheetId!;
  return cachedSpreadsheetId;
}

// New function to verify email against "Students List"
export async function verifyStudentEmail(email: string): Promise<boolean> {
  try {
    if (!cachedStudentListId) {
      cachedStudentListId = await findSpreadsheetId(STUDENTS_LIST_SHEET_NAME);
    }

    if (!cachedStudentListId) {
      console.error(`Spreadsheet "${STUDENTS_LIST_SHEET_NAME}" not found.`);
      return false; // Fail safe: if list doesn't exist, no one gets in.
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: cachedStudentListId,
      range: `${STUDENTS_LIST_TAB_NAME}!A:B`, // scanning first few columns
    });

    const rows = response.data.values;
    if (!rows) return false;

    // Flatten rows and check if email exists (case-insensitive)
    const allEmails = rows.flat().map(e => String(e).toLowerCase().trim());
    return allEmails.includes(email.toLowerCase().trim());

  } catch (error) {
    console.error('Error verifying student email:', error);
    return false;
  }
}

export async function getMissionByEmail(email: string): Promise<MissionRecord | null> {
  try {
    const spreadsheetId = await ensureMissionSpreadsheetExists();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:G`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Check column 0 (Email)
      if (row[0] && row[0].toLowerCase().trim() === email.toLowerCase().trim()) {
        return {
          email: row[0],
          title: row[1],
          lore: row[2],
          antagonist: row[3],
          task: row[4],
          techStack: row[5],
          timestamp: row[6],
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting mission:', error);
    throw error;
  }
}

export async function saveMission(mission: MissionRecord): Promise<void> {
  try {
    const spreadsheetId = await ensureMissionSpreadsheetExists();
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          mission.email,
          mission.title,
          mission.lore,
          mission.antagonist,
          mission.task,
          mission.techStack,
          mission.timestamp,
        ]],
      },
    });
  } catch (error) {
    console.error('Error saving mission:', error);
    throw error;
  }
}