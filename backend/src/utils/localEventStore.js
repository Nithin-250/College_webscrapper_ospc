import fs from "fs";
import path from "path";

const resolveStorePath = () => {
  const customPath = process.env.LOCAL_EVENT_STORE_PATH;
  if (customPath) {
    return path.resolve(customPath);
  }

  return path.resolve(process.cwd(), "..", "local-events-cache.json");
};

const STORE_PATH = resolveStorePath();

const ensureDirectory = () => {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const readStore = () => {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(STORE_PATH, "utf8");
    if (!raw) {
      return [];
    }

    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Failed to read local event store", error);
    return [];
  }
};

const writeStore = (entries) => {
  ensureDirectory();
  fs.writeFileSync(STORE_PATH, JSON.stringify(entries, null, 2), "utf8");
};

const normalizeEntry = (entry) => {
  if (!entry) return null;

  const normalized = {
    id: entry.id,
    data: entry.data ? { ...entry.data, origin: entry.data.origin ?? "local" } : undefined,
    deleted: Boolean(entry.deleted),
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
  };

  return normalized;
};

export const listLocalEntries = () => readStore();

export const listLocalEvents = () =>
  readStore()
    .filter((entry) => !entry.deleted && entry.data)
    .map((entry) => ({ ...entry.data, origin: entry.data.origin ?? "local" }));

export const findLocalEvent = (id) => {
  const entry = readStore().find((item) => item.id === id && !item.deleted && item.data);
  return entry ? { ...entry.data, origin: entry.data.origin ?? "local" } : null;
};

export const saveLocalEvent = (event) => {
  if (!event?.id) {
    throw new Error("Event must include an id to be saved locally");
  }

  const entries = readStore();
  const normalized = normalizeEntry({ id: event.id, data: { ...event, origin: event.origin ?? "local" }, deleted: false });
  const existingIndex = entries.findIndex((item) => item.id === normalized.id);

  if (existingIndex >= 0) {
    entries[existingIndex] = normalized;
  } else {
    entries.push(normalized);
  }

  writeStore(entries);
  return normalized.data;
};

export const markLocalEventDeleted = (id) => {
  if (!id) return false;

  const entries = readStore();
  const existingIndex = entries.findIndex((item) => item.id === id);
  const deletionEntry = normalizeEntry({ id, deleted: true });

  if (existingIndex >= 0) {
    entries[existingIndex] = {
      ...entries[existingIndex],
      data: undefined,
      deleted: true,
      updatedAt: deletionEntry.updatedAt,
    };
  } else {
    entries.push(deletionEntry);
  }

  writeStore(entries);
  return true;
};

export const removeLocalEventEntry = (id) => {
  if (!id) return false;

  const entries = readStore();
  const filtered = entries.filter((entry) => entry.id !== id);

  if (filtered.length === entries.length) {
    return false;
  }

  writeStore(filtered);
  return true;
};
