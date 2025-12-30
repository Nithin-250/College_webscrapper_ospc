import type { Event, EventStatus } from "@/types/event";

const getBackendEnvUrl = () => {
  try {
    const meta = import.meta as unknown as {
      env?: Record<string, string | undefined>;
    };
    return meta?.env?.VITE_BACKEND_URL ?? "";
  } catch (error) {
    console.warn("Unable to read VITE_BACKEND_URL from import.meta", error);
    return "";
  }
};

const API_BASE_URL = getBackendEnvUrl().replace(/\/$/, "");

const resolveApiBase = () => {
  // Always use the Render backend directly
  return "https://college-webscrapper-ospc.onrender.com";
};

const buildApiUrl = (
  path: string,
  params?: Record<string, string | number | undefined>
) => {
  const apiBase = resolveApiBase();
  
  // Use URL constructor for direct API calls
  const url = new URL(path, apiBase);

  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .forEach(([key, value]) => url.searchParams.set(key, String(value)));
  }

  return url.toString();
};

const ensureIsoString = (value: unknown): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) {
      return trimmed;
    }

    return date.toISOString();
  }

  try {
    const date = new Date(value as unknown as string);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  } catch (error) {
    console.warn("Failed to parse date value", value, error);
    return null;
  }
};

type RawEventRecord = {
  [key: string]: unknown;
  id?: unknown;
  _id?: unknown;
  uuid?: unknown;
  start_date?: unknown;
  startDate?: unknown;
  end_date?: unknown;
  endDate?: unknown;
  deadline?: unknown;
  registration_deadline?: unknown;
  deadlineAt?: unknown;
  time?: unknown;
  event_time?: unknown;
  fee?: unknown;
  description?: unknown;
  source_link?: unknown;
  sourceLink?: unknown;
  source_type?: unknown;
  sourceType?: unknown;
  status?: unknown;
  created_at?: unknown;
  createdAt?: unknown;
  updated_at?: unknown;
  updatedAt?: unknown;
};

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  return null;
};

const normalizeEventRecord = (record: RawEventRecord): Event => {
  if (!record) {
    throw new Error("Invalid event record received from API");
  }

  const idValue = record.id ?? record._id ?? record.uuid;
  if (!idValue) {
    throw new Error("Event record is missing an identifier");
  }

  const startDate = ensureIsoString(record.start_date ?? record.startDate) ?? new Date().toISOString();
  const endDate = ensureIsoString(record.end_date ?? record.endDate) ?? startDate;
  const deadline = ensureIsoString(record.deadline ?? record.registration_deadline ?? record.deadlineAt);
  const createdAt = ensureIsoString(record.created_at ?? record.createdAt) ?? new Date().toISOString();
  const updatedAt = ensureIsoString(record.updated_at ?? record.updatedAt) ?? createdAt;

  return {
    id: String(idValue),
    name: toStringOrNull(record.name) ?? "Untitled Event",
    organizer: toStringOrNull(record.organizer) ?? "Unknown Organizer",
    category: toStringOrNull(record.category) ?? "General",
    venue: toStringOrNull(record.venue) ?? "To be announced",
    start_date: startDate,
    end_date: endDate,
    deadline,
    time: toStringOrNull(record.time ?? record.event_time),
    fee: toStringOrNull(record.fee) ?? "Free",
    description: toStringOrNull(record.description),
    source_link: toStringOrNull(record.source_link ?? record.sourceLink),
    source_type: (toStringOrNull(record.source_type ?? record.sourceType) ?? "manual") as Event["source_type"],
    status: (toStringOrNull(record.status) ?? "approved") as Event["status"],
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const body = await response.text();
    const message = body || `API request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

// Fetch approved events for public view
export async function fetchApprovedEvents(): Promise<Event[]> {
  const apiUrl = buildApiUrl("/api/events", { status: "approved" });
  console.log("=== API DEBUG ===");
  console.log("Fetching events from:", apiUrl);
  console.log("Current hostname:", typeof window !== "undefined" ? window.location.hostname : "server");
  console.log("Resolved API base:", resolveApiBase());
  console.log("Is relative URL:", !apiUrl.startsWith("http"));
  console.log("================");
  
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await parseJsonResponse<unknown>(response);
    console.log("Events data received:", Array.isArray(data) ? data.length : "not an array");

    if (!Array.isArray(data)) {
      console.warn("Unexpected events payload", data);
      return [];
    }

    return data.map((record) => normalizeEventRecord(record as RawEventRecord));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Fetch single event by ID
export const fetchEventById = async (id: string): Promise<Event | null> => {
  const response = await fetch(buildApiUrl(`/api/events/${id}`));

  if (response.status === 404) {
    return null;
  }

  const data = await parseJsonResponse<RawEventRecord>(response);
  return normalizeEventRecord(data);
};
