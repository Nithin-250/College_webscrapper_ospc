const REQUIRED_EVENT_FIELDS = [
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

const parseDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const getMissingEventFields = (payload) =>
  REQUIRED_EVENT_FIELDS.filter((field) => {
    const value = payload?.[field];
    if (field === "fee") {
      return value === undefined || value === null || String(value).trim() === "";
    }

    return !value;
  });

export const normalizeEventPayload = (payload, defaults = {}) => {
  const normalized = {
    ...defaults,
    ...payload,
  };

  ["startDate", "endDate", "deadline"].forEach((field) => {
    const parsed = parseDate(normalized[field]);
    if (parsed) {
      normalized[field] = parsed;
    } else {
      delete normalized[field];
    }
  });

  normalized.status = normalized.status || defaults.status || "pending";
  normalized.sourceType = normalized.sourceType || defaults.sourceType || "manual";

  if (!normalized.time) {
    normalized.time = "TBA";
  }

  if (!normalized.fee) {
    normalized.fee = "Free";
  }

  return normalized;
};

export const buildEventUpsertQuery = (normalized) => ({
  name: normalized.name,
  organizer: normalized.organizer,
  startDate: normalized.startDate,
});

export { REQUIRED_EVENT_FIELDS };
