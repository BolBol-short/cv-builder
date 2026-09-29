// Classic template — single column, modeled on common Cambodian CVs:
// photo + personal details up top, then Summary → Experience → Education → etc.
import { contactItems, personalFacts, sectionsWithContent } from "../utils/format";
import {
  Page, Photo, Tags, ContactList, ExperienceList, EducationList,
  CertificationList, LanguageList, ReferenceList,
} from "./shared";

export function Classic({ cv, t, lang }) {
  const { personal } = cv;
  const facts = personalFacts(personal, t, lang);
  const show = sectionsWithContent(cv);

  return (
    <Page className="px-14 py-12">
      <header className="flex items-start gap-6 border-b-2 border-(--accent) pb-5">
        <Photo src={personal.photo} className="h-36 w-28 border border-slate-200" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] leading-tight font-bold text-slate-900">
            {personal.name || t("cv.yourName")}
          </h1>
          {personal.headline && (
            <p className="mt-0.5 text-[15px] font-medium text-(--accent)">{personal.headline}</p>
          )}
          <ContactList items={contactItems(personal)} className="mt-3 grid grid-cols-2 gap-x-4 space-y-0 gap-y-1" />
        </div>
      </header>

      {facts.length > 0 && (
        <Section title={t("section.personal")}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
            {facts.map((f) => (
              <div key={f.label} className="flex gap-2">
                <dt className="w-32 shrink-0 text-slate-500">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {show.summary && (
        <Section title={t("section.summary")}>
          <p className="text-[13px] leading-relaxed whitespace-pre-line">{cv.summary}</p>
        </Section>
      )}
      {show.experience && (
        <Section title={t("section.experience")}><ExperienceList cv={cv} t={t} lang={lang} /></Section>
      )}
      {show.education && (
        <Section title={t("section.education")}><EducationList cv={cv} t={t} lang={lang} /></Section>
      )}
      {show.certifications && (
        <Section title={t("section.certifications")}><CertificationList cv={cv} lang={lang} /></Section>
      )}

      <div className="grid grid-cols-2 gap-x-8">
        {show.skills && (
          <Section title={t("section.skills")}><Tags items={cv.skills} /></Section>
        )}
        {show.languages && (
          <Section title={t("section.languages")}><LanguageList cv={cv} t={t} /></Section>
        )}
      </div>
      {show.hobbies && (
        <Section title={t("section.hobbies")}><Tags items={personal.hobbies} /></Section>
      )}
      {show.references && (
        <Section title={t("section.references")}><ReferenceList cv={cv} /></Section>
      )}
    </Page>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 border-b border-slate-200 pb-1 text-[13px] font-bold tracking-wider text-(--accent) uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
