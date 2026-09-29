// Building blocks shared by every template. Everything here prints, so: valid
// HTML only, and `break-inside-avoid` on anything that shouldn't split across pages.
import { Icon } from "../components/Icon";
import { optionLabel } from "../i18n/translations";
import { formatMonth, formatRange, toBullets } from "../utils/format";

// A4 at 96dpi is 794px wide. Min height = printable height of page 1
// (297mm minus the 10mm bottom margin ≈ 1085px). Preview scales this box to fit.
export function Page({ children, className = "" }) {
  return (
    <div id="cv-preview" className={`cv-page min-h-[1085px] w-[794px] bg-white text-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function Photo({ src, className = "" }) {
  if (!src) return null;
  return <img src={src} alt="" className={`shrink-0 object-cover ${className}`} />;
}

export function Bullets({ text, className = "" }) {
  const lines = toBullets(text);
  if (lines.length === 0) return null;
  if (lines.length === 1) return <p className={`text-[13px] leading-relaxed ${className}`}>{lines[0]}</p>;
  return (
    <ul className={`list-disc space-y-0.5 pl-4 text-[13px] leading-relaxed marker:text-(--accent) ${className}`}>
      {lines.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  );
}

export function ContactList({ items, className = "", iconClass = "text-(--accent)" }) {
  return (
    <ul className={`space-y-1.5 text-[13px] ${className}`}>
      {items.map((c) => (
        <li key={c.type + c.value} className="flex items-start gap-2 break-all">
          <span className={`mt-0.5 ${iconClass}`}><Icon name={c.type} className="h-3.5 w-3.5" /></span>
          <span>{c.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function Tags({ items, className = "bg-slate-100 text-slate-700" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded px-2 py-0.5 text-[12px] ${className}`}>{item}</span>
      ))}
    </div>
  );
}

// Generic "heading / sub / date / bullets" entry used for jobs and schooling.
export function Entry({ title, subtitle, date, place, body }) {
  return (
    <div className="mb-3 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-semibold text-slate-900">{title}</p>
        {date && <p className="shrink-0 text-[12px] font-medium text-slate-500">{date}</p>}
      </div>
      {(subtitle || place) && (
        <p className="text-[13px] text-(--accent)">
          {[subtitle, place].filter(Boolean).join(" · ")}
        </p>
      )}
      {body && <Bullets text={body} className="mt-1 text-slate-700" />}
    </div>
  );
}

// ---- section bodies, identical across templates ----

export function ExperienceList({ cv, t, lang }) {
  return cv.experience.map((x) => (
    <Entry key={x.id} title={x.jobTitle} subtitle={x.company} place={x.location}
      date={formatRange(x, t, lang)} body={x.description} />
  ));
}

export function EducationList({ cv, t, lang }) {
  return cv.education.map((x) => (
    <Entry key={x.id} title={x.degree || x.institution}
      subtitle={x.degree ? x.institution : ""} place={x.location}
      date={formatRange(x, t, lang)}
      body={x.gpa ? `${t("field.gpa")}: ${x.gpa}` : ""} />
  ));
}

export function CertificationList({ cv, lang }) {
  return (
    <ul className="space-y-1.5 text-[13px]">
      {cv.certifications.map((c) => (
        <li key={c.id} className="break-inside-avoid">
          <span className="font-semibold text-slate-900">{c.name}</span>
          {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
          {c.date && <span className="text-slate-500"> ({formatMonth(c.date, lang)})</span>}
        </li>
      ))}
    </ul>
  );
}

export function LanguageList({ cv, t, className = "", levelClass = "text-slate-500" }) {
  return (
    <ul className={`space-y-1 text-[13px] ${className}`}>
      {cv.personal.languages.filter((l) => l.language).map((l) => (
        <li key={l.id} className="flex justify-between gap-2">
          <span>{l.language}</span>
          {l.level && <span className={levelClass}>{optionLabel(t, "level", l.level)}</span>}
        </li>
      ))}
    </ul>
  );
}

export function ReferenceList({ cv, columns = 2 }) {
  return (
    <div className={`grid gap-3 text-[13px] ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {cv.references.map((r) => (
        <div key={r.id} className="break-inside-avoid">
          <p className="font-semibold text-slate-900">{r.personName}</p>
          {r.position && <p className="text-slate-600">{r.position}</p>}
          {r.companyName && <p className="text-slate-600">{r.companyName}</p>}
          {r.link && <p className="text-(--accent)">{r.link}</p>}
        </div>
      ))}
    </div>
  );
}
