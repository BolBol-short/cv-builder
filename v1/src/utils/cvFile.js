import { emptyCV } from "../context/cvData";
import { isLang } from "../i18n/translations";
import { TEMPLATE_IDS, DEFAULT_TEMPLATE } from "../templates/templateIds";

// Save-file contract ("the wrapper"):
//   { version: 1, settings: { accentColor, template, cvLang }, cv: <emptyCV shape> }
// The wrapper lives AROUND the CV data — emptyCV itself only ever gains fields,
// so old/partial files can't crash the app as long as we merge over emptyCV.

export const DEFAULT_ACCENT = "#2563eb";
export const STORAGE_KEY = "cv-builder-draft-v1";
export const UI_LANG_KEY = "cv-builder-ui-lang";
const ACCENT_RE = /^#[0-9a-fA-F]{6}$/;

const asArray = (value) => (Array.isArray(value) ? value : []);

// Old saves stored "Female"/"Married"; new code stores lowercase option codes.
const asCode = (value) => (typeof value === "string" ? value.toLowerCase() : "");

// Defensive merge: unknown/missing fields fall back to emptyCV defaults.
// Two levels deep is enough — the only nesting is cv.personal.<lists>.
function normalizeCV(raw) {
  const personal = { ...emptyCV.personal, ...(raw?.personal ?? {}) };
  return {
    ...emptyCV,
    ...raw,
    personal: {
      ...personal,
      gender: asCode(personal.gender),
      maritalStatus: asCode(personal.maritalStatus),
      hobbies: asArray(personal.hobbies),
      links: asArray(personal.links),
      languages: asArray(personal.languages),
    },
    experience: asArray(raw?.experience),
    education: asArray(raw?.education),
    certifications: asArray(raw?.certifications),
    skills: asArray(raw?.skills),
    references: asArray(raw?.references),
  };
}

export function defaultSettings() {
  return { accentColor: DEFAULT_ACCENT, template: DEFAULT_TEMPLATE, cvLang: detectLang() };
}

function normalizeSettings(raw) {
  const d = defaultSettings();
  return {
    accentColor: typeof raw?.accentColor === "string" && ACCENT_RE.test(raw.accentColor)
      ? raw.accentColor : d.accentColor,
    template: TEMPLATE_IDS.includes(raw?.template) ? raw.template : d.template,
    cvLang: isLang(raw?.cvLang) ? raw.cvLang : d.cvLang,
  };
}

// ---- JSON export (download) ----
// Blob + temporary <a download>: everything stays client-side, no server needed.
export function exportCV(cv, settings) {
  const wrapper = { version: 1, settings, cv };
  const blob = new Blob([JSON.stringify(wrapper, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slug = cv.personal.name.trim().replace(/\s+/g, "-").toLowerCase();
  a.download = `cv-${slug || "builder"}.json`;
  a.click();
  URL.revokeObjectURL(url); // free the memory once the browser has it
}

// ---- JSON import ----
// Accepts both the v1 wrapper and a legacy bare-CV file ({version missing}).
// Throws Error(<translation key>) — caller translates and shows it.
export function parseCVFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("error.invalidJson");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("error.unexpected");
  }
  const rawCv = data.cv ?? data; // no .cv key → treat as legacy bare CV
  return {
    settings: normalizeSettings(data.settings),
    cv: normalizeCV(rawCv),
  };
}

// ---- localStorage draft (auto-save) ----
// try/catch because a big base64 photo can hit the ~5MB quota (QuotaExceededError).
export function saveDraft(cv, settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, settings, cv }));
  } catch {
    // Quota full or storage blocked — keep the app working, just don't persist.
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return parseCVFile(raw);
  } catch {
    // fall through to a blank CV
  }
  return { settings: defaultSettings(), cv: emptyCV };
}

// ---- UI language (per browser, not part of the CV file) ----
function detectLang() {
  return typeof navigator !== "undefined" && navigator.language?.startsWith("km") ? "km" : "en";
}

export function loadUiLang() {
  try {
    const saved = localStorage.getItem(UI_LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // storage blocked
  }
  return detectLang();
}

export function saveUiLang(lang) {
  try {
    localStorage.setItem(UI_LANG_KEY, lang);
  } catch {
    // storage blocked
  }
}
