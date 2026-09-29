// Minimal template — centered header, lots of whitespace, section titles in a
// narrow left column. Accent color used sparingly.
import { contactItems, personalFacts, sectionsWithContent } from "../utils/format";
import {
  Page, Photo, ExperienceList, EducationList,
  CertificationList, LanguageList, ReferenceList,
} from "./shared";

export function Minimal({ cv, t, lang }) {
  const { personal } = cv;
  const facts = personalFacts(personal, t, lang);
  const contact = contactItems(personal);
  const show = sectionsWithContent(cv);

  return (
    <Page className="px-16 py-14">
      <header className="text-center">
        {personal.photo && (
          <Photo src={personal.photo} className="mx-auto mb-4 h-24 w-24 rounded-full" />
        )}
        <h1 className="text-[30px] font-light tracking-wide text-slate-900">
          {personal.name || t("cv.yourName")}
        </h1>
        {personal.headline && (
          <p className="mt-1 text-[13px] tracking-[0.25em] text-(--accent) uppercase">{personal.headline}</p>
        )}
        {contact.length > 0 && (
          <p className="mt-3 text-[12px] text-slate-500">{contact.map((c) => c.value).join("   |   ")}</p>
        )}
      </header>

      <div className="mt-8 border-t border-slate-200">
        {facts.length > 0 && (
          <Row title={t("section.personal")}>
            <p className="text-[13px] text-slate-700">
              {facts.map((f) => `${f.label}: ${f.value}`).join("  ·  ")}
            </p>
          </Row>
        )}
        {show.summary && (
          <Row title={t("section.summary")}>
            <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700">{cv.summary}</p>
          </Row>
        )}
        {show.experience && (
          <Row title={t("section.experience")}><ExperienceList cv={cv} t={t} lang={lang} /></Row>
        )}
        {show.education && (
          <Row title={t("section.education")}><EducationList cv={cv} t={t} lang={lang} /></Row>
        )}
        {show.certifications && (
          <Row title={t("section.certifications")}><CertificationList cv={cv} lang={lang} /></Row>
        )}
        {show.skills && (
          <Row title={t("section.skills")}>
            <p className="text-[13px] text-slate-700">{cv.skills.join("  ·  ")}</p>
          </Row>
        )}
        {show.languages && (
          <Row title={t("section.languages")}><LanguageList cv={cv} t={t} className="max-w-72" /></Row>
        )}
        {show.hobbies && (
          <Row title={t("section.hobbies")}>
            <p className="text-[13px] text-slate-700">{personal.hobbies.join("  ·  ")}</p>
          </Row>
        )}
        {show.references && (
          <Row title={t("section.references")}><ReferenceList cv={cv} /></Row>
        )}
      </div>
    </Page>
  );
}

function Row({ title, children }) {
  return (
    <section className="grid grid-cols-[150px_1fr] gap-6 border-b border-slate-100 py-4">
      <h2 className="pt-0.5 text-[12px] font-semibold tracking-wider text-slate-400 uppercase">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
