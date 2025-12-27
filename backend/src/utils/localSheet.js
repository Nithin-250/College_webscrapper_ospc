import crypto from "crypto";
import fs from "fs";
import path from "path";
import XLSX from "xlsx";

const CANDIDATE_FILENAMES = [
  "VIT_EventHub_Filled.xlsx",
  "VIT_EventHub.xlsx",
];

const ensureDate = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "number") {
    const serialDate = XLSX.SSF?.parse_date_code?.(value);
    if (serialDate) {
      const { y, m, d } = serialDate;
      const parsed = new Date(Date.UTC(y, m - 1, d));
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const toISODateString = (date) =>
  date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : undefined;

const generateStableId = (name, date) =>
  crypto.createHash("md5").update(`${name}-${date ?? "na"}`).digest("hex");

const guessCategory = (name) => {
  if (!name) return process.env.DEFAULT_EVENT_CATEGORY || "General";
  const lower = name.toLowerCase();

  if (lower.includes("hackathon")) return "Hackathon";
  if (lower.includes("workshop")) return "Workshop";
  if (lower.includes("seminar")) return "Seminar";
  if (lower.includes("lecture")) return "Guest Lecture";
  if (lower.includes("sports")) return "Sports";
  if (lower.includes("cultural")) return "Cultural";
  if (lower.includes("fest")) return "Fest";
  if (lower.includes("competition")) return "Competition";

  return process.env.DEFAULT_EVENT_CATEGORY || "General";
};

const resolveCandidatePaths = () => {
  const cwd = process.cwd();
  const backendDir = path.resolve(cwd);
  const projectRoot = path.resolve(backendDir, "..");

  const envPath = process.env.LOCAL_EVENT_SHEET_PATH
    ? path.resolve(process.env.LOCAL_EVENT_SHEET_PATH)
    : null;

  const explicitPaths = (filename) => [
    path.resolve(cwd, filename),
    path.resolve(projectRoot, filename),
  ];

  const candidates = [];

  if (envPath) {
    candidates.push(envPath);
  }

  CANDIDATE_FILENAMES.forEach((filename) => {
    explicitPaths(filename).forEach((candidate) => {
      if (!candidates.includes(candidate)) {
        candidates.push(candidate);
      }
    });
  });

  return candidates;
};

const buildDescription = ({ eligibility, teamSize, status }) => {
  const parts = [];

  if (eligibility) {
    parts.push(`Eligibility: ${eligibility}`);
  }

  if (teamSize) {
    parts.push(`Team Size: ${teamSize}`);
  }

  if (status) {
    parts.push(`Status: ${status}`);
  }

  return parts.join(" | ") || "Details to be announced.";
};

const transformRow = (row) => {
  const name = String(row["Event Name"] || "").trim();
  if (!name) {
    return null;
  }

  const rawStart = row["Event Date"] || row.Date || row["Start Date"];
  const startDate = ensureDate(rawStart);
  if (!startDate) {
    return null;
  }

  const endDate = ensureDate(row["End Date"] || row["Event End Date"]) || startDate;
  const deadline = ensureDate(row.Deadline || row["Registration Deadline"] || row["Deadline Date"]) || startDate;

  const organizer = String(row.Organizer || row.Department || "VIT Chennai").trim() || "VIT Chennai";
  const venue = String(row["Event Venue"] || row.Venue || "To be announced").trim() || "To be announced";

  const feeValue = row.Fee || row["Event Fee"] || row["Payment"];
  const fee = String(feeValue ?? "Free").trim() || "Free";

  const timeValue = row["Event Time"] || row.Time || row["Duration"];
  const time = String(timeValue || "TBA").trim() || "TBA";

  const eligibility = String(row.Eligibility || row["Who can apply"] || "Open to all").trim() || undefined;
  const teamSize = String(row["Team Size"] || row["Team Size (if any)"] || "").trim() || undefined;
  const statusText = String(row.Status || row["Registration Status"] || "" ).trim() || undefined;
  const sourceLink = String(row.Link || row.URL || row["Event Link"] || "").trim() || "#";

  let normalizedStatus = "approved";
  if (statusText) {
    const lowerStatus = statusText.toLowerCase();

    if (lowerStatus.includes("reject")) {
      normalizedStatus = "rejected";
    } else if (lowerStatus.includes("pending")) {
      normalizedStatus = "pending";
    } else {
      normalizedStatus = "approved";
    }
  }

  const startDateIso = toISODateString(startDate);
  const endDateIso = toISODateString(endDate) ?? startDateIso;
  const deadlineIso = toISODateString(deadline) ?? startDateIso;

  const id = generateStableId(name, startDateIso);
  const createdAt = deadlineIso ?? startDateIso ?? new Date().toISOString();
  const updatedAt = new Date().toISOString();

  return {
    id,
    name,
    organizer,
    category: guessCategory(name),
    venue,
    start_date: startDateIso ?? new Date().toISOString(),
    end_date: endDateIso ?? startDateIso ?? new Date().toISOString(),
    deadline: deadlineIso,
    time,
    fee,
    description: buildDescription({ eligibility, teamSize, status: statusText }),
    source_link: sourceLink,
    source_type: "sheet",
    status: ["pending", "approved", "rejected"].includes(normalizedStatus)
      ? normalizedStatus
      : "approved",
    created_at: createdAt,
    updated_at: updatedAt,
    // CamelCase properties for backend compatibility
    startDate: startDateIso,
    endDate: endDateIso,
    deadline: deadlineIso,
    sourceLink,
    sourceType: "sheet",
    createdAt,
    updatedAt,
  };
};

export const resolveLocalSheetPath = () => {
  const candidates = resolveCandidatePaths();

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

export const isLocalSheetAvailable = () => Boolean(resolveLocalSheetPath());

export const readEventsFromLocalSheet = () => {
  const filePath = resolveLocalSheetPath();

  if (!filePath) {
    return { success: false, reason: "Local event sheet not found", rows: [], source: "local" };
  }

  try {
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const [sheetName] = workbook.SheetNames;

    if (!sheetName) {
      return { success: true, rows: [] };
    }

    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
      dateNF: "yyyy-mm-dd",
    });

    const rows = rawRows
      .map(transformRow)
      .filter((row) => row !== null);

    return { success: true, rows, source: "local" };
  } catch (error) {
    return { success: false, reason: error.message, rows: [], source: "local" };
  }
};
