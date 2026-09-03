import { emptyCV } from "../context/cvData";

// Save-file contract ("the wrapper"):
//   { version: 1, settings: { accentColor }, cv: <emptyCV shape> }
// The wrapper lives AROUND the CV data — emptyCV itself never changes shape,
// so old/partial files can't crash the app as long as we merge over emptyCV.

export const DEFAULT_ACCENT = "#2563eb";
export const STORAGE_KEY = "cv-builder-draft-v1";
const ACCENT_RE = /^#[0-9a-fA-F]{6}$/;

const asArray = (value) => (Array.isArray(value) ? value : []);

// Defensive merge: unknown/missing fields fall back to emptyCV defaults.
// Two levels deep is enough — the only nesting is cv.personal.<lists>.
function normalizeCV(raw) {
  const personal = { ...emptyCV.personal, ...(raw?.personal ?? {}) };
  return {
    ...emptyCV,
    ...raw,
    personal: {
      ...personal,
      hobbies: asArray(personal.hobbies),
      links: asArray(personal.links),
      languages: asArray(personal.languages),
    },
    experience: asArray(raw?.experience),
    education: asArray(raw?.education),
    skills: asArray(raw?.skills),
    references: asArray(raw?.references),
  };
}

function normalizeAccent(raw) {
  return typeof raw === "string" && ACCENT_RE.test(raw) ? raw : DEFAULT_ACCENT;
}

// ---- JSON export (download) ----
// Blob + temporary <a download>: everything stays client-side, no server needed.
export function exportCV(cv, accentColor) {
  const wrapper = { version: 1, settings: { accentColor }, cv };
  const blob = new Blob([JSON.stringify(wrapper, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cv-builder.json";
  a.click();
  URL.revokeObjectURL(url); // free the memory once the browser has it
}

// ---- JSON import ----
// Accepts both the v1 wrapper and a legacy bare-CV file ({version missing}).
// Throws on unparseable JSON — caller shows the error.
export function parseCVFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Not a valid JSON file.");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("Unexpected file contents.");
  }
  const rawCv = data.cv ?? data; // no .cv key → treat as legacy bare CV
  return {
    accentColor: normalizeAccent(data.settings?.accentColor),
    cv: normalizeCV(rawCv),
  };
}

// ---- localStorage draft (auto-save) ----
// try/catch because a big base64 photo can hit the ~5MB quota (QuotaExceededError).
export function saveDraft(cv, accentColor) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, settings: { accentColor }, cv })
    );
  } catch {
    // Quota full or storage blocked — keep the app working, just don't persist.
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accentColor: DEFAULT_ACCENT, cv: emptyCV };
    return parseCVFile(raw);
  } catch {
    return { accentColor: DEFAULT_ACCENT, cv: emptyCV };
  }
}
