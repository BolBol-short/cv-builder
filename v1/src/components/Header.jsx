import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";
import { LANGS } from "../i18n/translations";

// Top bar: brand, UI-language switch, file actions (in a "More" menu) and the
// primary Download PDF button.
export function Header({ onUiLang, onImport, onExport, onSample, onReset }) {
  const { t, lang } = useI18n();
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Icon name="file" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base leading-tight font-bold text-slate-900">{t("app.name")}</h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">{t("app.tagline")}</p>
          </div>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 p-0.5" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onUiLang(l.code)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                lang === l.code ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {l.short}
            </button>
          ))}
        </div>

        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFile} className="hidden" />
        <Menu label={t("action.more")}>
          {(close) => (
            <>
              <MenuItem icon="upload" onClick={() => { close(); fileInputRef.current?.click(); }}>{t("action.import")}</MenuItem>
              <MenuItem icon="save" onClick={() => { close(); onExport(); }}>{t("action.export")}</MenuItem>
              <MenuItem icon="sparkle" onClick={() => { close(); onSample(); }}>{t("action.sample")}</MenuItem>
              <div className="my-1 border-t border-slate-100" />
              <MenuItem icon="trash" danger onClick={() => { close(); onReset(); }}>{t("action.reset")}</MenuItem>
            </>
          )}
        </Menu>

        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:px-4"
        >
          <Icon name="download" />
          <span className="hidden sm:inline">{t("action.pdf")}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
}

function Menu({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        aria-haspopup="menu"
        aria-expanded={open}
        title={label}
      >
        <Icon name="more" />
        <span className="hidden md:inline">{label}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, onClick, danger, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm ${
        danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon name={icon} />
      {children}
    </button>
  );
}
