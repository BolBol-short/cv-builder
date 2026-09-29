// Modern template — accent-colored sidebar (photo, contact, personal facts,
// skills, languages, hobbies) beside a white main column.
import { contactItems, personalFacts, sectionsWithContent } from "../utils/format";
import {
  Page, Photo, ContactList, ExperienceList, EducationList,
  CertificationList, LanguageList, ReferenceList,
} from "./shared";

export function Modern({ cv, t, lang }) {
  const { personal } = cv;
  const facts = personalFacts(personal, t, lang);
  const contact = contactItems(personal);
  const show = sectionsWithContent(cv);

  return (
    <Page className="grid grid-cols-[260px_1fr]">
      <aside className="bg-(--accent) px-7 py-10 text-white">
        {personal.photo && (
          <Photo src={personal.photo} className="mx-auto mb-6 h-40 w-40 rounded-full border-4 border-white/30" />
        )}

        {contact.length > 0 && (
          <SideSection title={t("section.contact")}>
            <ContactList items={contact} iconClass="text-white/70" />
          </SideSection>
        )}

        {facts.length > 0 && (
          <SideSection title={t("section.personal")}>
            <dl className="space-y-1.5 text-[13px]">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] text-white/60 uppercase">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </SideSection>
        )}

        {show.skills && (
          <SideSection title={t("section.skills")}>
            <ul className="space-y-1 text-[13px]">
              {cv.skills.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />{s}
                </li>
              ))}
            </ul>
          </SideSection>
        )}

        {show.languages && (
          <SideSection title={t("section.languages")}>
            <LanguageList cv={cv} t={t} levelClass="text-white/70" />
          </SideSection>
        )}

        {show.hobbies && (
          <SideSection title={t("section.hobbies")}>
            <p className="text-[13px]">{personal.hobbies.join(" · ")}</p>
          </SideSection>
        )}
      </aside>

      <main className="px-10 py-12">
        <h1 className="text-[34px] leading-tight font-extrabold text-slate-900">
          {personal.name || t("cv.yourName")}
        </h1>
        {personal.headline && (
          <p className="mt-1 text-[16px] font-medium tracking-wide text-(--accent) uppercase">
            {personal.headline}
          </p>
        )}

        {show.summary && (
          <MainSection title={t("section.about")}>
            <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700">{cv.summary}</p>
          </MainSection>
        )}
        {show.experience && (
          <MainSection title={t("section.experience")}><ExperienceList cv={cv} t={t} lang={lang} /></MainSection>
        )}
        {show.education && (
          <MainSection title={t("section.education")}><EducationList cv={cv} t={t} lang={lang} /></MainSection>
        )}
        {show.certifications && (
          <MainSection title={t("section.certifications")}><CertificationList cv={cv} lang={lang} /></MainSection>
        )}
        {show.references && (
          <MainSection title={t("section.references")}><ReferenceList cv={cv} /></MainSection>
        )}
      </main>
    </Page>
  );
}

function SideSection({ title, children }) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="mb-2 border-b border-white/25 pb-1 text-[12px] font-bold tracking-widest uppercase">{title}</h2>
      {children}
    </section>
  );
}

function MainSection({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 flex items-center gap-3 text-[15px] font-bold text-slate-900">
        <span className="h-5 w-1.5 rounded-full bg-(--accent)" />
        {title}
      </h2>
      {children}
    </section>
  );
}
