import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CustomizedInput } from "./components/CustomizedInput";
import { StringListField } from "./components/StringListField";
import { ObjectListField } from "./components/ObjectListField";
import { Preview } from "./components/Preview";
import { PhotoPicker } from "./components/PhotoPicker";
import {
  addString, removeString,
  addItem, updateItem, removeItem,
  newExperience, newEducation, newReference, newLanguage,
} from "./utils/cv";
import {
  exportCV, parseCVFile, saveDraft, loadDraft,
} from "./utils/cvFile";
import { SKILL_OPTIONS } from "./constants/SKILL_OPTIONS";
import { HOBBY_OPTIONS } from "./constants/HOBBY_OPTIONS";
import { LANGUAGE_OPTIONS } from "./constants/LANGUAGE_OPTIONS";

function App() {
  // Hydrate once from localStorage; everything after is plain state.
  const [draft] = useState(loadDraft);
  const [cv, setCv] = useState(draft.cv);
  const [accentColor, setAccentColor] = useState(draft.accentColor);
  // §4: A4 preview hidden by default on narrow screens; toggle is the escape valve.
  const [showPreview, setShowPreview] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches
  );

  // Debounced auto-save: 500ms after the last keystroke, write the wrapper.
  useEffect(() => {
    const t = setTimeout(() => saveDraft(cv, accentColor), 500);
    return () => clearTimeout(t);
  }, [cv, accentColor]);

  const fileInputRef = useRef(null);

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = parseCVFile(await file.text());
      setCv(imported.cv);
      setAccentColor(imported.accentColor);
    } catch (err) {
      alert(err.message);
    }
    e.target.value = ""; // allow re-selecting the same file
  };

  // ---- state helpers ----
  const updatePersonal = (field, value) =>
    setCv({ ...cv, personal: { ...cv.personal, [field]: value } });

  const updateField = (field, value) => setCv({ ...cv, [field]: value });

  // string arrays that live under personal (hobbies, links)
  const addPersonalString = (field, value) =>
    updatePersonal(field, addString(cv.personal[field], value));
  const removePersonalString = (field, value) =>
    updatePersonal(field, removeString(cv.personal[field], value));

  // string array at top level (skills)
  const addSkill = (value) => updateField("skills", addString(cv.skills, value));
  const removeSkill = (value) => updateField("skills", removeString(cv.skills, value));

  // object arrays: build one reusable set of handlers per section
  const listHandlers = (field, factory, underPersonal = false) => {
    const list = underPersonal ? cv.personal[field] : cv[field];
    const write = (next) =>
      underPersonal ? updatePersonal(field, next) : updateField(field, next);
    return {
      onAdd: () => write(addItem(list, factory())),
      onUpdate: (id, key, value) => write(updateItem(list, id, key, value)),
      onRemove: (id) => write(removeItem(list, id)),
    };
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="no-print border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">CV Builder</h1>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Import JSON
            </button>
            <button
              type="button"
              onClick={() => exportCV(cv, accentColor)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Export JSON
            </button>
            <label className="no-print flex items-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5" title="Accent color">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              <span className="text-sm font-medium text-slate-700">Accent</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="no-print rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        {/* ---------------- FORM ---------------- */}
        <section className="no-print space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <Fieldset title="Personal">
            <PhotoPicker value={cv.personal.photo}
              onChange={(dataUrl) => updatePersonal("photo", dataUrl)} />
            <CustomizedInput placeholder="Full name" value={cv.personal.name}
              onChange={(e) => updatePersonal("name", e.target.value)} />
            <CustomizedInput type="email" placeholder="Email" value={cv.personal.email}
              onChange={(e) => updatePersonal("email", e.target.value)} />
            <CustomizedInput type="tel" placeholder="Telephone" value={cv.personal.tel}
              onChange={(e) => updatePersonal("tel", e.target.value)} />
            <CustomizedInput placeholder="Location" value={cv.personal.location}
              onChange={(e) => updatePersonal("location", e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={cv.personal.gender}
                onChange={(e) => updatePersonal("gender", e.target.value)}
              >
                <option value="">Gender…</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <CustomizedInput type="date" placeholder="Date of birth" value={cv.personal.dob}
                onChange={(e) => updatePersonal("dob", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CustomizedInput placeholder="Nationality" value={cv.personal.nationality}
                onChange={(e) => updatePersonal("nationality", e.target.value)} />
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={cv.personal.maritalStatus}
                onChange={(e) => updatePersonal("maritalStatus", e.target.value)}
              >
                <option value="">Marital status…</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <StringListField label="Links" placeholder="https://…"
              values={cv.personal.links}
              onAdd={(v) => addPersonalString("links", v)}
              onRemove={(v) => removePersonalString("links", v)} />

            <ObjectListField
              label="Languages" items={cv.personal.languages}
              fields={[
                { name: "language", placeholder: "Language", options: LANGUAGE_OPTIONS },
                { name: "level", placeholder: "Level (e.g. Native, Fluent)" },
              ]}
              {...listHandlers("languages", newLanguage, true)}
            />
          </Fieldset>

          <Fieldset title="Summary">
            <textarea
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
              placeholder="A short summary about you"
              value={cv.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </Fieldset>

          <Fieldset title="Experience">
            <ObjectListField
              label="Experience" items={cv.experience}
              fields={[
                { name: "jobTitle", placeholder: "Job title" },
                { name: "company", placeholder: "Company" },
                { name: "location", placeholder: "Location" },
                { name: "startDate", placeholder: "Start", type: "month" },
                { name: "endDate", placeholder: "End", type: "month" },
                { name: "description", placeholder: "What you did", type: "textarea" },
              ]}
              {...listHandlers("experience", newExperience)}
            />
          </Fieldset>

          <Fieldset title="Education">
            <ObjectListField
              label="Education" items={cv.education}
              fields={[
                { name: "institution", placeholder: "Institution" },
                { name: "gpa", placeholder: "GPA" },
                { name: "location", placeholder: "Location" },
                { name: "startDate", placeholder: "Start", type: "month" },
                { name: "endDate", placeholder: "End", type: "month" },
              ]}
              {...listHandlers("education", newEducation)}
            />
          </Fieldset>

          <Fieldset title="Skills">
            <StringListField label="Skills" placeholder="Add a skill" options={SKILL_OPTIONS}
              values={cv.skills} onAdd={addSkill} onRemove={removeSkill} />
          </Fieldset>

          <Fieldset title="Hobbies">
            <StringListField label="Hobbies" placeholder="Add a hobby" options={HOBBY_OPTIONS}
              values={cv.personal.hobbies}
              onAdd={(v) => addPersonalString("hobbies", v)}
              onRemove={(v) => removePersonalString("hobbies", v)} />
          </Fieldset>

          <Fieldset title="References">
            <ObjectListField
              label="References" items={cv.references}
              fields={[
                { name: "personName", placeholder: "Referee name" },
                { name: "companyName", placeholder: "Company" },
                { name: "link", placeholder: "Contact / link" },
              ]}
              {...listHandlers("references", newReference)}
            />
          </Fieldset>
        </section>

        {/* ---------------- PREVIEW ---------------- */}
        <section className={`print-area lg:sticky lg:top-6 lg:self-start ${showPreview ? "" : "hidden"}`}>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <Preview cv={cv} accentColor={accentColor} />
          </div>
        </section>
      </main>
    </div>
  );
}

function Fieldset({ title, children }) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default App;