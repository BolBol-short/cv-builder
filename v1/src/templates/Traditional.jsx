// Traditional template — the formal Cambodian layout: centered title
// ("ប្រវត្តិរូបសង្ខេប" / "CURRICULUM VITAE"), 4×6 photo top-right, a table of
// personal details, then Roman-numbered sections with tabular education.
import { optionLabel } from "../i18n/translations";
import { formatMonth, formatRange, personalFacts, sectionsWithContent, toBullets } from "../utils/format";
import { Page, Photo } from "./shared";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function Traditional({ cv, t, lang }) {
  const { personal } = cv;
  const show = sectionsWithContent(cv);
  const rows = [
    { label: t("field.name"), value: personal.name },
    ...personalFacts(personal, t, lang),
    { label: t("field.location"), value: personal.location },
    { label: t("field.tel"), value: personal.tel },
    { label: t("field.email"), value: personal.email },
    ...personal.links.map((link) => ({ label: t("section.links"), value: link })),
  ].filter((r) => r.value);

  // Build the numbered section list up front so numbering skips empty sections.
  const sections = [
    rows.length > 0 && {
      title: t("section.personal"),
      body: (
        <table className="w-full text-[13px]">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="w-44 py-0.5 align-top text-slate-600">{r.label}</td>
                <td className="w-4 py-0.5 align-top">:</td>
                <td className="py-0.5 font-medium break-all">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    show.summary && {
      title: t("section.summary"),
      body: <p className="text-[13px] leading-relaxed whitespace-pre-line">{cv.summary}</p>,
    },
    show.education && {
      title: t("section.education"),
      body: (
        <Table
          rows={cv.education.map((x) => [
            formatRange(x, t, lang),
            <><b>{x.institution}</b>{x.location && `, ${x.location}`}</>,
            [x.degree, x.gpa && `${t("field.gpa")}: ${x.gpa}`].filter(Boolean).join(" — "),
          ])}
        />
      ),
    },
    show.experience && {
      title: t("section.experience"),
      body: cv.experience.map((x) => (
        <div key={x.id} className="mb-3 grid grid-cols-[170px_1fr] gap-3 text-[13px] break-inside-avoid">
          <p className="font-medium text-slate-600">{formatRange(x, t, lang)}</p>
          <div>
            <p className="font-bold">{x.jobTitle}</p>
            <p className="text-slate-700">{[x.company, x.location].filter(Boolean).join(", ")}</p>
            {toBullets(x.description).length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {toBullets(x.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
          </div>
        </div>
      )),
    },
    show.certifications && {
      title: t("section.certifications"),
      body: (
        <Table
          rows={cv.certifications.map((c) => [
            formatMonth(c.date, lang),
            <b key="n">{c.name}</b>,
            c.issuer,
          ])}
        />
      ),
    },
    show.languages && {
      title: t("section.languages"),
      body: (
        <Table
          rows={personal.languages.filter((l) => l.language).map((l) => [
            l.language, optionLabel(t, "level", l.level), "",
          ])}
        />
      ),
    },
    show.skills && {
      title: t("section.skills"),
      body: (
        <ul className="grid grid-cols-2 gap-x-6 text-[13px] list-disc pl-4">
          {cv.skills.map((s) => <li key={s}>{s}</li>)}
        </ul>
      ),
    },
    show.hobbies && {
      title: t("section.hobbies"),
      body: <p className="text-[13px]">{personal.hobbies.join(", ")}</p>,
    },
    show.references && {
      title: t("section.references"),
      body: (
        <ol className="list-decimal space-y-1.5 pl-5 text-[13px]">
          {cv.references.map((r) => (
            <li key={r.id} className="break-inside-avoid">
              <b>{r.personName}</b>
              {[r.position, r.companyName].filter(Boolean).length > 0 &&
                `, ${[r.position, r.companyName].filter(Boolean).join(", ")}`}
              {r.link && <span className="block text-slate-600">{r.link}</span>}
            </li>
          ))}
        </ol>
      ),
    },
  ].filter(Boolean);

  return (
    <Page className="px-16 py-12">
      <header className="relative min-h-40">
        <h1
          className={`pt-8 text-center text-(--accent) ${
            lang === "km" ? "font-moul text-[26px]" : "text-[26px] font-bold tracking-[0.2em] uppercase"
          }`}
        >
          {t("cv.title")}
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-40 bg-(--accent)" />
        {personal.headline && (
          <p className="mt-3 text-center text-[14px] font-medium text-slate-600">{personal.headline}</p>
        )}
        <Photo src={personal.photo} className="absolute top-0 right-0 h-36 w-24 border border-slate-400" />
      </header>

      {sections.map((s, i) => (
        <section key={s.title} className="mt-6">
          <h2 className="mb-2 text-[14px] font-bold text-slate-900">
            {ROMAN[i]}. <span className="border-b border-(--accent) pb-0.5 text-(--accent)">{s.title}</span>
          </h2>
          <div className="pl-6">{s.body}</div>
        </section>
      ))}
    </Page>
  );
}

function Table({ rows }) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i} className="break-inside-avoid border-b border-slate-200 last:border-0">
            <td className="w-[170px] py-1 pr-3 align-top font-medium text-slate-600">{cells[0]}</td>
            <td className="py-1 pr-3 align-top">{cells[1]}</td>
            <td className="py-1 align-top text-slate-700">{cells[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
