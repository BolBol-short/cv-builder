import { optionLabel } from "../i18n/translations";

const MONTHS = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  km: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"],
};

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";
export const toKhmerDigits = (s) => String(s).replace(/\d/g, (d) => KHMER_DIGITS[d]);

const localizeDigits = (s, lang) => (lang === "km" ? toKhmerDigits(s) : s);

// "2024-03" → "Mar 2024" / "មីនា ២០២៤". Anything unparseable is shown as typed.
export function formatMonth(value, lang) {
  const m = /^(\d{4})-(\d{2})/.exec(value ?? "");
  if (!m) return value ?? "";
  const month = (MONTHS[lang] ?? MONTHS.en)[Number(m[2]) - 1];
  return localizeDigits(`${month} ${m[1]}`, lang);
}

// "2000-05-12" → "12 May 2000" / "១២ ឧសភា ២០០០".
export function formatDate(value, lang) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!m) return value ?? "";
  const month = (MONTHS[lang] ?? MONTHS.en)[Number(m[2]) - 1];
  return localizeDigits(`${Number(m[3])} ${month} ${m[1]}`, lang);
}

export function formatRange(item, t, lang) {
  const start = formatMonth(item.startDate, lang);
  const end = item.current ? t("cv.present") : formatMonth(item.endDate, lang);
  if (!start && !end) return "";
  if (!start) return end;
  return `${start} – ${end || t("cv.present")}`;
}

// Description textarea → bullet lines. Strips "-", "•", "*" the user typed.
export function toBullets(text) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

// Label/value pairs for the personal-facts block every template shows.
export function personalFacts(personal, t, lang) {
  return [
    ["field.gender", optionLabel(t, "gender", personal.gender)],
    ["field.dob", formatDate(personal.dob, lang)],
    ["field.pob", personal.pob],
    ["field.nationality", personal.nationality],
    ["field.maritalStatus", optionLabel(t, "marital", personal.maritalStatus)],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => ({ label: t(key), value }));
}

// Which sections have content — templates skip empty ones.
export function sectionsWithContent(cv) {
  const p = cv.personal;
  return {
    summary: Boolean(cv.summary.trim()),
    experience: cv.experience.length > 0,
    education: cv.education.length > 0,
    certifications: cv.certifications.length > 0,
    skills: cv.skills.length > 0,
    languages: p.languages.some((l) => l.language),
    hobbies: p.hobbies.length > 0,
    references: cv.references.length > 0,
  };
}

export function contactItems(personal) {
  return [
    { type: "phone", value: personal.tel },
    { type: "mail", value: personal.email },
    { type: "pin", value: personal.location },
    ...personal.links.map((link) => ({ type: "link", value: link })),
  ].filter((c) => c.value);
}
