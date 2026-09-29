import { useState } from "react";
import { CustomizedInput, TextArea, Select, Field } from "./CustomizedInput";
import { StringListField } from "./StringListField";
import { ObjectListField } from "./ObjectListField";
import { PhotoPicker } from "./PhotoPicker";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";
import {
  addString, removeString, addItem, updateItem, removeItem, moveItem,
  newExperience, newEducation, newReference, newLanguage, newCertification,
} from "../utils/cv";
import {
  SKILL_OPTIONS, HOBBY_OPTIONS, LANGUAGE_OPTIONS, NATIONALITY_OPTIONS,
  GENDERS, MARITAL_STATUSES, LANGUAGE_LEVELS,
} from "../constants/options";

// The whole "Content" tab: one collapsible card per CV section.
// `cvLang` picks suggestion lists, since suggestions go into the CV text itself.
export function ContentEditor({ cv, setCv, cvLang }) {
  const { t } = useI18n();
  const p = cv.personal;

  // ---- state helpers (functional updates, so rapid edits never go stale) ----
  const updatePersonal = (field, value) =>
    setCv((c) => ({ ...c, personal: { ...c.personal, [field]: value } }));
  const updateField = (field, value) => setCv((c) => ({ ...c, [field]: value }));

  // Apply fn to a list living at cv[field] or cv.personal[field].
  const updateList = (field, underPersonal, fn) =>
    setCv((c) => underPersonal
      ? { ...c, personal: { ...c.personal, [field]: fn(c.personal[field]) } }
      : { ...c, [field]: fn(c[field]) });

  const stringHandlers = (field, underPersonal) => ({
    values: underPersonal ? p[field] : cv[field],
    onAdd: (v) => updateList(field, underPersonal, (l) => addString(l, v)),
    onRemove: (v) => updateList(field, underPersonal, (l) => removeString(l, v)),
  });

  const listHandlers = (field, factory, underPersonal = false) => ({
    items: underPersonal ? p[field] : cv[field],
    onAdd: () => updateList(field, underPersonal, (l) => addItem(l, factory())),
    onUpdate: (id, key, value) => updateList(field, underPersonal, (l) => updateItem(l, id, key, value)),
    onRemove: (id) => updateList(field, underPersonal, (l) => removeItem(l, id)),
    onMove: (id, dir) => updateList(field, underPersonal, (l) => moveItem(l, id, dir)),
  });

  const text = (field, labelKey, props = {}) => (
    <Field label={t(labelKey)}>
      <CustomizedInput value={p[field]} onChange={(e) => updatePersonal(field, e.target.value)} {...props} />
    </Field>
  );

  const codeOptions = (group, codes) => codes.map((c) => ({ value: c, label: t(`${group}.${c}`) }));
  const monthFields = (currentLabelKey) => [
    { name: "startDate", label: t("field.startDate"), type: "month" },
    { name: "endDate", label: t("field.endDate"), type: "month", disabled: (item) => item.current },
    { name: "current", label: t(currentLabelKey), type: "checkbox" },
  ];

  return (
    <div className="space-y-3">
      <Section icon="user" title={t("section.personal")} defaultOpen>
        <PhotoPicker value={p.photo} onChange={(v) => updatePersonal("photo", v)} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {text("name", "field.name", { autoComplete: "name" })}
          {text("headline", "field.headline", { placeholder: t("field.headlinePh") })}
          {text("email", "field.email", { type: "email", autoComplete: "email" })}
          {text("tel", "field.tel", { type: "tel", autoComplete: "tel" })}
          <Field label={t("field.location")} className="sm:col-span-2">
            <CustomizedInput value={p.location} autoComplete="street-address"
              onChange={(e) => updatePersonal("location", e.target.value)} />
          </Field>
          <Field label={t("field.gender")}>
            <Select value={p.gender} placeholder={t("field.select")} options={codeOptions("gender", GENDERS)}
              onChange={(e) => updatePersonal("gender", e.target.value)} />
          </Field>
          <Field label={t("field.maritalStatus")}>
            <Select value={p.maritalStatus} placeholder={t("field.select")}
              options={codeOptions("marital", MARITAL_STATUSES)}
              onChange={(e) => updatePersonal("maritalStatus", e.target.value)} />
          </Field>
          {text("dob", "field.dob", { type: "date" })}
          {text("pob", "field.pob")}
          <Field label={t("field.nationality")}>
            <CustomizedInput value={p.nationality} list="nationality-list"
              onChange={(e) => updatePersonal("nationality", e.target.value)} />
            <datalist id="nationality-list">
              {NATIONALITY_OPTIONS[cvLang].map((o) => <option key={o} value={o} />)}
            </datalist>
          </Field>
        </div>
      </Section>

      <Section icon="text" title={t("section.summary")} filled={Boolean(cv.summary.trim())}>
        <TextArea rows={4} placeholder={t("field.summaryPh")} value={cv.summary}
          onChange={(e) => updateField("summary", e.target.value)} />
      </Section>

      <Section icon="briefcase" title={t("section.experience")} count={cv.experience.length}>
        <ObjectListField
          titleOf={(x) => [x.jobTitle, x.company].filter(Boolean).join(" · ")}
          fields={[
            { name: "jobTitle", label: t("field.jobTitle") },
            { name: "company", label: t("field.company") },
            { name: "location", label: t("field.location"), wide: true },
            ...monthFields("field.currentJob"),
            { name: "description", label: t("field.description"), type: "textarea", hint: t("field.descriptionHint") },
          ]}
          {...listHandlers("experience", newExperience)}
        />
      </Section>

      <Section icon="cap" title={t("section.education")} count={cv.education.length}>
        <ObjectListField
          titleOf={(x) => x.institution}
          fields={[
            { name: "institution", label: t("field.institution"), wide: true },
            { name: "degree", label: t("field.degree") },
            { name: "gpa", label: t("field.gpa") },
            { name: "location", label: t("field.location"), wide: true },
            ...monthFields("field.currentStudy"),
          ]}
          {...listHandlers("education", newEducation)}
        />
      </Section>

      <Section icon="award" title={t("section.certifications")} count={cv.certifications.length}>
        <ObjectListField
          titleOf={(x) => x.name}
          fields={[
            { name: "name", label: t("field.certName"), wide: true },
            { name: "issuer", label: t("field.issuer") },
            { name: "date", label: t("field.date"), type: "month" },
          ]}
          {...listHandlers("certifications", newCertification)}
        />
      </Section>

      <Section icon="star" title={t("section.skills")} count={cv.skills.length}>
        <StringListField placeholder={t("field.skillPh")} options={SKILL_OPTIONS[cvLang]}
          {...stringHandlers("skills", false)} />
      </Section>

      <Section icon="globe" title={t("section.languages")} count={p.languages.length}>
        <ObjectListField
          titleOf={(x) => x.language}
          fields={[
            { name: "language", label: t("field.language"), suggestions: LANGUAGE_OPTIONS[cvLang] },
            { name: "level", label: t("field.level"), type: "select", placeholder: t("field.select"),
              options: codeOptions("level", LANGUAGE_LEVELS) },
          ]}
          {...listHandlers("languages", newLanguage, true)}
        />
      </Section>

      <Section icon="heart" title={t("section.hobbies")} count={p.hobbies.length}>
        <StringListField placeholder={t("field.hobbyPh")} options={HOBBY_OPTIONS[cvLang]}
          {...stringHandlers("hobbies", true)} />
      </Section>

      <Section icon="link" title={t("section.links")} count={p.links.length}>
        <StringListField type="url" placeholder={t("field.linkPh")} {...stringHandlers("links", true)} />
      </Section>

      <Section icon="users" title={t("section.references")} count={cv.references.length}>
        <ObjectListField
          titleOf={(x) => x.personName}
          fields={[
            { name: "personName", label: t("field.refName") },
            { name: "position", label: t("field.refPosition") },
            { name: "companyName", label: t("field.refCompany") },
            { name: "link", label: t("field.refContact") },
          ]}
          {...listHandlers("references", newReference)}
        />
      </Section>
    </div>
  );
}

// Collapsible card. `count` shows a badge; `filled` shows a check for non-list sections.
function Section({ icon, title, count, filled, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const done = filled || count > 0;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50"
        aria-expanded={open}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          done ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
        }`}>
          <Icon name={icon} />
        </span>
        <span className="flex-1 font-semibold text-slate-800">{title}</span>
        {count > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">{count}</span>
        )}
        {filled && <Icon name="check" className="h-4 w-4 text-blue-600" />}
        <Icon name="chevron" className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-4 border-t border-slate-100 px-4 py-4">{children}</div>}
    </section>
  );
}
