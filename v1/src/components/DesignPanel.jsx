import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";
import { LANGS } from "../i18n/translations";
import { TEMPLATE_IDS } from "../templates/templateIds";
import { ACCENT_PRESETS } from "../constants/options";

// Template / color / CV-language picker. `onChange(key, value)` updates settings.
export function DesignPanel({ settings, onChange }) {
  const { t } = useI18n();
  const isPreset = ACCENT_PRESETS.includes(settings.accentColor.toLowerCase());

  return (
    <div className="space-y-7">
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">{t("design.template")}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TEMPLATE_IDS.map((id) => {
            const active = settings.template === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange("template", id)}
                className={`group rounded-xl border-2 p-2 text-left transition ${
                  active ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                }`}
                aria-pressed={active}
              >
                <div style={{ "--accent": settings.accentColor }}>
                  <Thumb id={id} />
                </div>
                <p className={`mt-2 flex items-center justify-between text-sm font-medium ${active ? "text-blue-700" : "text-slate-700"}`}>
                  {t(`template.${id}`)}
                  {active && <Icon name="check" className="h-4 w-4" />}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">{t("design.color")}</h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENT_PRESETS.map((color) => {
            const active = settings.accentColor.toLowerCase() === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => onChange("accentColor", color)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-white ring-offset-2 transition ${
                  active ? "ring-2 ring-slate-800" : "hover:scale-110"
                }`}
                style={{ background: color }}
                aria-label={color}
                aria-pressed={active}
              >
                {active && <Icon name="check" className="h-4 w-4" />}
              </button>
            );
          })}
          <label
            className={`relative flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm text-slate-600 ${
              isPreset ? "border-slate-300" : "border-slate-800 ring-1 ring-slate-800"
            }`}
          >
            <span className="h-5 w-5 rounded-full border border-slate-200" style={{ background: settings.accentColor }} />
            {t("design.custom")}
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-semibold text-slate-800">{t("design.cvLang")}</h3>
        <p className="mb-3 text-xs text-slate-500">{t("design.cvLangHint")}</p>
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onChange("cvLang", l.code)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${
                settings.cvLang === l.code ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <p className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
        <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0" />
        {t("design.printTip")}
      </p>
    </div>
  );
}

// Tiny schematic of each layout so the picker is visual, not just names.
function Thumb({ id }) {
  const line = (w, extra = "") => <div className={`h-1 rounded-full bg-slate-200 ${extra}`} style={{ width: w }} />;
  const accentLine = (w) => <div className="h-1.5 rounded-full bg-(--accent)" style={{ width: w }} />;
  const lines = (n) => Array.from({ length: n }, (_, i) => <div key={i}>{line(`${90 - (i % 3) * 15}%`)}</div>);

  const body = {
    classic: (
      <div className="p-2">
        <div className="flex gap-1.5 border-b-2 border-(--accent) pb-1.5">
          <div className="h-6 w-5 bg-slate-300" />
          <div className="flex-1 space-y-1">{accentLine("70%")}{line("50%")}</div>
        </div>
        <div className="mt-2 space-y-1">{accentLine("35%")}{lines(3)}{accentLine("35%")}{lines(3)}</div>
      </div>
    ),
    modern: (
      <div className="grid h-full grid-cols-[35%_1fr]">
        <div className="space-y-1 bg-(--accent) p-1.5">
          <div className="mx-auto h-5 w-5 rounded-full bg-white/60" />
          <div className="h-1 rounded-full bg-white/50" /><div className="h-1 w-3/4 rounded-full bg-white/50" />
          <div className="h-1 rounded-full bg-white/50" />
        </div>
        <div className="space-y-1 p-1.5">{line("80%", "h-1.5 bg-slate-400")}{accentLine("40%")}{lines(4)}</div>
      </div>
    ),
    professional: (
      <div>
        <div className="flex items-center gap-1.5 bg-(--accent) p-1.5">
          <div className="h-5 w-4 rounded-sm bg-white/60" />
          <div className="h-1.5 w-1/2 rounded-full bg-white/70" />
        </div>
        <div className="grid grid-cols-[1fr_35%]">
          <div className="space-y-1 p-1.5">{accentLine("40%")}{lines(4)}</div>
          <div className="h-full space-y-1 bg-(--accent)/10 p-1.5">{lines(3)}</div>
        </div>
      </div>
    ),
    minimal: (
      <div className="p-2 text-center">
        <div className="mx-auto h-4 w-4 rounded-full bg-slate-300" />
        <div className="mx-auto mt-1 space-y-1">{line("60%", "mx-auto h-1.5 bg-slate-400")}{line("40%", "mx-auto")}</div>
        <div className="mt-2 grid grid-cols-[25%_1fr] gap-1 border-t border-slate-200 pt-1.5 text-left">
          {line("80%")}<div className="space-y-1">{lines(2)}</div>
          {line("80%")}<div className="space-y-1">{lines(2)}</div>
        </div>
      </div>
    ),
    traditional: (
      <div className="relative p-2">
        <div className="absolute top-1.5 right-1.5 h-6 w-4 border border-slate-400 bg-slate-100" />
        <div className="mx-auto mt-2 h-1.5 w-1/2 rounded-full bg-(--accent)" />
        <div className="mt-3 space-y-1">
          <div className="flex gap-1">{line("30%")}{line("40%", "bg-slate-300")}</div>
          <div className="flex gap-1">{line("30%")}{line("30%", "bg-slate-300")}</div>
          <div className="flex gap-1">{line("30%")}{line("45%", "bg-slate-300")}</div>
          {accentLine("35%")}{lines(2)}
        </div>
      </div>
    ),
  }[id];

  return <div className="aspect-[210/297] overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">{body}</div>;
}
