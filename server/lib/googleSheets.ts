import { google } from 'googleapis';
import { MissionRecord } from '../../shared/schema';

const SPREADSHEET_NAME = 'Chaos Architect Missions';
const SHEET_NAME = 'Missions';
const STUDENTS_LIST_SHEET_NAME = 'Students List';
const STUDENTS_LIST_TAB_NAME = 'list';

let cachedSpreadsheetId: string | null = null;
let cachedStudentListId: string | null = null;

// Helper to get authenticated clients only when needed
function getClients() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Missing Google Credentials in Environment Variables");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  return {
    sheets: google.sheets({ version: 'v4', auth }),
    drive: google.drive({ version: 'v3', auth })
  };
}

async function findSpreadsheetId(name: string): Promise<string | null> {
  const { drive } = getClients();
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

  const { sheets } = getClients();
  const existingId = await findSpreadsheetId(SPREADSHEET_NAME);
  if (existingId) {
    cachedSpreadsheetId = existingId;
    return cachedSpreadsheetId;
  }

  const createResponse = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: SPREADSHEET_NAME },
      sheets: [{
        properties: { title: SHEET_NAME },
        data: [{
          rowData: [{
            values: [
              { userEnteredValue: { stringValue: 'Email' } },
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

export async function verifyStudentEmail(email: string): Promise<boolean> {
  try {
    const { sheets } = getClients();
    
    if (!cachedStudentListId) {
      cachedStudentListId = await findSpreadsheetId(STUDENTS_LIST_SHEET_NAME);
    }

    if (!cachedStudentListId) {
      console.error(`Spreadsheet "${STUDENTS_LIST_SHEET_NAME}" not found.`);
      return false;
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: cachedStudentListId,
      range: `${STUDENTS_LIST_TAB_NAME}!A:B`,
    });

    const rows = response.data.values;
    if (!rows) return false;

    const allEmails = rows.flat().map(e => String(e).toLowerCase().trim());
    return allEmails.includes(email.toLowerCase().trim());

  } catch (error) {
    console.error('Error verifying student email:', error);
    return false;
  }
}

export async function getMissionByEmail(email: string): Promise<MissionRecord | null> {
  try {
    const { sheets } = getClients();
    const spreadsheetId = await ensureMissionSpreadsheetExists();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${SHEET_NAME}!A:G`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
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
    const { sheets } = getClients();
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