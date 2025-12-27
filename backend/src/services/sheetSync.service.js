import Event from "../models/event.model.js";
import {
  isGoogleSheetsConfigured,
  readEventsFromSheet,
  overwriteEventsSheet,
} from "../utils/googleSheets.js";
import {
  buildEventUpsertQuery,
  getMissingEventFields,
  normalizeEventPayload,
} from "../utils/eventFormatter.js";

const SHEET_HEADERS = [
  "name",
  "organizer",
  "category",
  "venue",
  "startDate",
  "endDate",
  "deadline",
  "time",
  "fee",
  "description",
  "sourceLink",
  "sourceType",
  "status",
];

let lastSyncTimestamp = 0;
let syncTimer;

const getSyncInterval = () => {
  const value = Number(process.env.SHEET_SYNC_INTERVAL_MS);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }

  return 5 * 60 * 1000; // default 5 minutes
};

const mapRowToEvent = (row) => {
  if (!row || row.length === 0) {
    return null;
  }

  const payload = {};

  SHEET_HEADERS.forEach((header, index) => {
    if (row[index] !== undefined) {
      payload[header] = row[index];
    }
  });

  return payload;
};

export const syncSheetEventsToDB = async ({ force = false } = {}) => {
  if (!isGoogleSheetsConfigured()) {
    return { synced: false, reason: "Google Sheets not configured" };
  }

  const now = Date.now();
  const interval = getSyncInterval();

  if (!force && now - lastSyncTimestamp < interval) {
    return { synced: false, reason: "Recently synced" };
  }

  const { success, rows, reason } = await readEventsFromSheet();

  if (!success) {
    return { synced: false, reason };
  }

  if (!rows || rows.length === 0) {
    lastSyncTimestamp = now;
    return { synced: true, count: 0 };
  }

  let upsertedCount = 0;

  await Promise.all(
    rows.map(async (row) => {
      const payload = mapRowToEvent(row);

      if (!payload) {
        return;
      }

      const missing = getMissingEventFields(payload);

      if (missing.length > 0) {
        return;
      }

      const normalized = normalizeEventPayload(payload, {
        sourceType: payload.sourceType || "sheet",
        status: payload.status || "approved",
      });

      const query = buildEventUpsertQuery(normalized);

      await Event.findOneAndUpdate(
        query,
        {
          ...normalized,
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      upsertedCount += 1;
    })
  );

  lastSyncTimestamp = Date.now();

  return { synced: true, count: upsertedCount };
};

export const startSheetSyncLoop = () => {
  if (!isGoogleSheetsConfigured()) {
    return;
  }

  if (syncTimer) {
    return;
  }

  syncTimer = setInterval(() => {
    syncSheetEventsToDB().catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Sheet sync failed:", error.message);
    });
  }, getSyncInterval());
};

export const stopSheetSyncLoop = () => {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = undefined;
  }
};

export const syncAllEventsToSheet = async () => {
  if (!isGoogleSheetsConfigured()) {
    return { success: false, reason: "Google Sheets not configured" };
  }

  const events = await Event.find().sort({ startDate: 1 }).lean();
  return overwriteEventsSheet(events);
};
