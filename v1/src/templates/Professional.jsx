// Professional template — full-width accent header band, then a wide main
// column and a tinted side column.
import { contactItems, personalFacts, sectionsWithContent } from "../utils/format";
import {
  Page, Photo, Tags, ContactList, ExperienceList, EducationList,
  CertificationList, LanguageList, ReferenceList,
} from "./shared";

export function Professional({ cv, t, lang }) {
  const { personal } = cv;
  const facts = personalFacts(personal, t, lang);
  const contact = contactItems(personal);
  const show = sectionsWithContent(cv);

  return (
    <Page className="flex flex-col">
      <header className="flex items-center gap-7 bg-(--accent) px-12 py-9 text-white">
        <Photo src={personal.photo} className="h-32 w-26 rounded-md border-2 border-white/40" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] leading-tight font-bold">{personal.name || t("cv.yourName")}</h1>
          {personal.headline && <p className="mt-1 text-[16px] text-white/85">{personal.headline}</p>}
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[1fr_250px]">
        <main className="px-12 py-8">
          {show.summary && (
            <Section title={t("section.summary")}>
              <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700">{cv.summary}</p>
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
          {show.references && (
            <Section title={t("section.references")}><ReferenceList cv={cv} /></Section>
          )}
        </main>

        <aside className="bg-(--accent)/6 px-7 py-8">
          {contact.length > 0 && (
            <Section title={t("section.contact")}><ContactList items={contact} /></Section>
          )}
          {facts.length > 0 && (
            <Section title={t("section.personal")}>
              <dl className="space-y-1.5 text-[13px]">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[11px] text-slate-500 uppercase">{f.label}</dt>
                    <dd className="font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}
          {show.skills && (
            <Section title={t("section.skills")}>
              <Tags items={cv.skills} className="bg-white text-slate-700 ring-1 ring-slate-200" />
            </Section>
          )}
          {show.languages && (
            <Section title={t("section.languages")}><LanguageList cv={cv} t={t} /></Section>
          )}
          {show.hobbies && (
            <Section title={t("section.hobbies")}><Tags items={personal.hobbies} className="bg-white text-slate-700 ring-1 ring-slate-200" /></Section>
          )}
        </aside>
      </div>
    </Page>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2.5 text-[13px] font-bold tracking-wider text-(--accent) uppercase">{title}</h2>
      {children}
    </section>
  );
}
