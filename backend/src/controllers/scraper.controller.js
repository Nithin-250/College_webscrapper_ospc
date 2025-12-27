import asyncHandler from "express-async-handler";
import Event from "../models/event.model.js";
import { appendEventsToSheet } from "../utils/googleSheets.js";
import { scrapeVitEventHub } from "../scrapers/vitEventHubScraper.js";

const REQUIRED_FIELDS = [
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
];

const normalizeEvent = (payload) => {
  const normalized = { ...payload };

  if (payload.startDate) {
    normalized.startDate = new Date(payload.startDate);
  }

  if (payload.endDate) {
    normalized.endDate = new Date(payload.endDate);
  }

  if (payload.deadline) {
    normalized.deadline = new Date(payload.deadline);
  }

  normalized.status = payload.status || "pending";
  normalized.sourceType = "scraper";

  return normalized;
};

const upsertEvents = async (events) => {
  const upserted = await Promise.all(
    events.map(async (eventPayload) => {
      const normalized = normalizeEvent(eventPayload);

      const query = {
        name: normalized.name,
        startDate: normalized.startDate,
        organizer: normalized.organizer,
      };

      const update = {
        ...normalized,
        updatedAt: new Date(),
      };

      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      };

      return Event.findOneAndUpdate(query, update, options);
    })
  );

  await appendEventsToSheet(upserted);

  return upserted;
};

export const pushScrapedEvents = asyncHandler(async (req, res) => {
  const { events } = req.body;

  if (!Array.isArray(events) || events.length === 0) {
    res.status(400);
    throw new Error("events array is required");
  }

  const invalidEntries = events.filter((event) =>
    REQUIRED_FIELDS.some((field) => !event[field])
  );

  if (invalidEntries.length > 0) {
    res.status(400);
    throw new Error("Some events are missing required fields");
  }

  const upsertResults = await upsertEvents(events);

  res.json({
    success: true,
    count: upsertResults.length,
    events: upsertResults,
  });
});

export const fetchVitEventHub = asyncHandler(async (req, res) => {
  const events = await scrapeVitEventHub();

  if (events.length === 0) {
    res.json({ success: true, count: 0, events: [] });
    return;
  }

  let storedEvents = [];

  if (req.query.persist === "true") {
    storedEvents = await upsertEvents(events);
  }

  res.json({
    success: true,
    count: events.length,
    events: req.query.persist === "true" ? storedEvents : events,
    persisted: req.query.persist === "true",
  });
});
