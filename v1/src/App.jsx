import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { ContentEditor } from "./components/ContentEditor";
import { DesignPanel } from "./components/DesignPanel";
import { Preview } from "./components/Preview";
import { Icon } from "./components/Icon";
import { I18nContext } from "./i18n/I18nContext";
import { makeT } from "./i18n/translations";
import { emptyCV } from "./context/cvData";
import { sampleCV } from "./constants/sampleCV";
import { completeness } from "./utils/cv";
import {
  exportCV, parseCVFile, saveDraft, loadDraft, loadUiLang, saveUiLang,
} from "./utils/cvFile";

function App() {
  // Hydrate once from localStorage; everything after is plain state.
  const [draft] = useState(loadDraft);
  const [cv, setCv] = useState(draft.cv);
  const [settings, setSettings] = useState(draft.settings);
  const [uiLang, setUiLang] = useState(loadUiLang);
  const [tab, setTab] = useState("content");   // content | design (editor panel)
  const [mobileView, setMobileView] = useState("edit"); // edit | preview (below lg)

  const i18n = useMemo(() => ({ lang: uiLang, t: makeT(uiLang) }), [uiLang]);
  const { t } = i18n;

  // Debounced auto-save: 500ms after the last keystroke, write the wrapper.
  useEffect(() => {
    const timer = setTimeout(() => saveDraft(cv, settings), 500);
    return () => clearTimeout(timer);
  }, [cv, settings]);

  useEffect(() => {
    document.documentElement.lang = uiLang;
    saveUiLang(uiLang);
  }, [uiLang]);

  const updateSetting = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handleImport = async (file) => {
    try {
      const imported = parseCVFile(await file.text());
      setCv(imported.cv);
      setSettings(imported.settings);
    } catch (err) {
      alert(t(err.message));
    }
  };

  const handleSample = () => {
    if (confirm(t("confirm.sample"))) setCv(sampleCV(settings.cvLang));
  };

  const handleReset = () => {
    if (confirm(t("confirm.reset"))) setCv(emptyCV);
  };

  const percent = completeness(cv);

  return (
    <I18nContext.Provider value={i18n}>
      <div className="app-shell min-h-screen bg-slate-100 text-slate-900">
        <Header
          onUiLang={setUiLang}
          onImport={handleImport}
          onExport={() => exportCV(cv, settings)}
          onSample={handleSample}
          onReset={handleReset}
        />

        {/* Mobile: switch between editor and preview */}
        <div className="no-print sticky top-[61px] z-10 border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <Segmented
            value={mobileView}
            onChange={setMobileView}
            options={[
              { value: "edit", label: t("tab.edit"), icon: "pencil" },
              { value: "preview", label: t("tab.preview"), icon: "eye" },
            ]}
          />
        </div>

        <main className="app-main mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          {/* ---------------- EDITOR ---------------- */}
          <section className={`no-print space-y-4 ${mobileView === "edit" ? "" : "hidden"} lg:block`}>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{t("progress.label")}</span>
                <span className="font-semibold text-blue-600">{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <Icon name="check" className="h-3.5 w-3.5" />
                {t("app.saved")}
              </p>
            </div>

            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "content", label: t("tab.content"), icon: "pencil" },
                { value: "design", label: t("tab.design"), icon: "palette" },
              ]}
            />

            {tab === "content" ? (
              <ContentEditor cv={cv} setCv={setCv} cvLang={settings.cvLang} />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <DesignPanel settings={settings} onChange={updateSetting} />
              </div>
            )}
          </section>

          {/* ---------------- PREVIEW ---------------- */}
          <section
            className={`print-area lg:sticky lg:top-[85px] lg:max-h-[calc(100vh-100px)] lg:self-start lg:overflow-y-auto lg:rounded-xl lg:bg-slate-200/60 lg:p-6 ${
              mobileView === "preview" ? "" : "hidden"
            } lg:block`}
          >
            <Preview cv={cv} settings={settings} />
          </section>
        </main>
      </div>
    </I18nContext.Provider>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="grid grid-flow-col gap-1 rounded-xl bg-slate-200/70 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
            value === o.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Icon name={o.icon} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default App;
