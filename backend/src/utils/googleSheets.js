import { google } from "googleapis";

let sheetsClient;

const resolveSheetRange = (fallback) =>
  process.env.GOOGLE_SHEET_RANGE?.trim() || fallback;

export const getSheetAppendRange = () => resolveSheetRange("Sheet1!A2");

export const getSheetDataRange = () => resolveSheetRange("Sheet1!A2:N");

const formatSheetDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

export const isGoogleSheetsConfigured = () =>
  Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );

export const getGoogleSheetsClient = async () => {
  if (!isGoogleSheetsConfigured()) {
    return null;
  }

  if (sheetsClient) {
    return sheetsClient;
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
};

export const appendEventsToSheet = async (events) => {
  const sheets = await getGoogleSheetsClient();

  if (!sheets) {
    return { success: false, reason: "Google Sheets not configured" };
  }

  if (!Array.isArray(events) || events.length === 0) {
    return { success: false, reason: "No events to append" };
  }

  const rows = events.map((event) => [
    event.name,
    event.organizer,
    event.category,
    event.venue,
    formatSheetDate(event.startDate),
    formatSheetDate(event.endDate),
    formatSheetDate(event.deadline),
    event.time,
    event.fee,
    event.description,
    event.sourceLink,
    event.sourceType,
    event.status,
    new Date().toISOString(),
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: getSheetAppendRange(),
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: rows,
    },
  });

  return { success: true };
};

export const readEventsFromSheet = async () => {
  const sheets = await getGoogleSheetsClient();

  if (!sheets) {
    return { success: false, reason: "Google Sheets not configured", rows: [] };
  }

  const range = getSheetDataRange();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });

  const rows = data.values || [];

  return { success: true, rows };
};

export const overwriteEventsSheet = async (events) => {
  const sheets = await getGoogleSheetsClient();

  if (!sheets) {
    return { success: false, reason: "Google Sheets not configured" };
  }

  const range = getSheetDataRange();

  await sheets.spreadsheets.values.clear({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });

  if (!events || events.length === 0) {
    return { success: true, count: 0 };
  }

  const rows = events.map((event) => [
    event.name,
    event.organizer,
    event.category,
    event.venue,
    formatSheetDate(event.startDate || event.start_date),
    formatSheetDate(event.endDate || event.end_date),
    formatSheetDate(event.deadline),
    event.time,
    event.fee,
    event.description,
    event.sourceLink || event.source_link,
    event.sourceType || event.source_type || "manual",
    event.status,
    formatSheetDate(event.updatedAt || event.updated_at || new Date()),
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });

  return { success: true, count: rows.length };
};
