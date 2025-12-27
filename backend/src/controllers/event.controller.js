import asyncHandler from "express-async-handler";
import Event from "../models/event.model.js";
import {
  getMissingEventFields,
  normalizeEventPayload,
} from "../utils/eventFormatter.js";
import { syncSheetEventsToDB } from "../services/sheetSync.service.js";
import {
  isGoogleSheetsConfigured,
} from "../utils/googleSheets.js";
import {
  isLocalSheetAvailable,
  readEventsFromLocalSheet,
} from "../utils/localSheet.js";

const parseFilters = (query) => {
  const filters = { status: "approved" };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.fee === "free") {
    filters.fee = /free/i;
  } else if (query.fee === "paid") {
    filters.fee = { $not: /free/i };
  } else if (query.fee) {
    filters.fee = query.fee;
  }

  if (query.startDate || query.endDate) {
    filters.startDate = {};

    if (query.startDate) {
      filters.startDate.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.startDate.$lte = new Date(query.endDate);
    }
  }

  if (query.status) {
    filters.status = query.status;
  }

  return filters;
};

const matchesSearch = (event, search) => {
  if (!search) return true;
  const haystack = [
    event.name,
    event.organizer,
    event.category,
    event.venue,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(search.toLowerCase());
};

const matchesDateRange = (event, startDate, endDate) => {
  if (!startDate && !endDate) return true;

  const eventDate = event.start_date || event.startDate;
  if (!eventDate) return false;

  const eventTime = new Date(eventDate).getTime();
  if (Number.isNaN(eventTime)) return false;

  if (startDate && eventTime < new Date(startDate).getTime()) {
    return false;
  }

  if (endDate && eventTime > new Date(endDate).getTime()) {
    return false;
  }

  return true;
};

const applyLocalFilters = (rows, req) => {
  const {
    category,
    fee,
    status,
    search,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  } = req.query;

  const effectiveStatus = status || "approved";

  let events = rows.filter((event) => {
    if (effectiveStatus && event.status !== effectiveStatus) return false;
    if (category && event.category?.toLowerCase() !== category.toLowerCase()) return false;

    if (fee === "free" && event.fee?.toLowerCase() !== "free") return false;
    if (fee === "paid" && event.fee?.toLowerCase() === "free") return false;
    if (fee && fee !== "free" && fee !== "paid") {
      if (!event.fee?.toLowerCase().includes(fee.toLowerCase())) return false;
    }

    if (!matchesDateRange(event, startDate, endDate)) return false;

    if (!matchesSearch(event, search)) return false;

    return true;
  });

  const sortField = sortBy || "start_date";
  const direction = sortOrder === "desc" ? -1 : 1;

  events = events.sort((a, b) => {
    const aValue = a[sortField] || a[camelCase(sortField)];
    const bValue = b[sortField] || b[camelCase(sortField)];

    if (!aValue && !bValue) return 0;
    if (!aValue) return 1 * direction;
    if (!bValue) return -1 * direction;

    const aTime = new Date(aValue).getTime();
    const bTime = new Date(bValue).getTime();

    if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
      return (aTime - bTime) * direction;
    }

    return String(aValue).localeCompare(String(bValue)) * direction;
  });

  return events;
};

const camelCase = (value = "") =>
  value.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

const shouldUseLocalSheet = () =>
  !isGoogleSheetsConfigured() && isLocalSheetAvailable();

export const getEvents = asyncHandler(async (req, res) => {
  if (shouldUseLocalSheet()) {
    const { success, rows, reason } = readEventsFromLocalSheet();

    if (!success) {
      res.status(500);
      throw new Error(reason || "Failed to read local events sheet");
    }

    const events = applyLocalFilters(rows, req);
    res.json(events);
    return;
  }

  await syncSheetEventsToDB({ force: req.query.refresh === "true" });

  const filters = parseFilters(req.query);
  const search = req.query.search;

  const query = Event.find(filters);

  if (search) {
    const regex = new RegExp(search, "i");
    query.or([{ name: regex }, { organizer: regex }, { category: regex }, { venue: regex }]);
  }

  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    query.sort({ [sortField]: sortOrder });
  } else {
    query.sort({ startDate: 1 });
  }

  const events = await query.exec();
  res.json(events);
});

export const getEventById = asyncHandler(async (req, res) => {
  if (shouldUseLocalSheet()) {
    const { success, rows, reason } = readEventsFromLocalSheet();

    if (!success) {
      res.status(500);
      throw new Error(reason || "Failed to read local events sheet");
    }

    const event = rows.find((row) => row.id === req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    if (event.status !== "approved") {
      res.status(403);
      throw new Error("Event not accessible");
    }

    res.json(event);
    return;
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (event.status !== "approved") {
    res.status(403);
    throw new Error("Event not accessible");
  }

  res.json(event);
});

