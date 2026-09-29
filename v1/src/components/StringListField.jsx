import { useState } from "react";
import { CustomizedInput } from "./CustomizedInput";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";

// Handles a single string array: skills, hobbies, links.
// Owns its own scratch input; Enter or "Add" commits. Calls onAdd(value) / onRemove(value).
// `options` (optional) shows one-click suggestion chips for values not added yet.
export function StringListField({ placeholder, values, onAdd, onRemove, options, type = "text" }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const suggestions = (options ?? []).filter((o) => !values.includes(o));

  const commit = () => {
    onAdd(draft);
    setDraft("");
  };

  return (
    <div>
      <div className="flex gap-2">
        <CustomizedInput
          type={type}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          onClick={commit}
          disabled={!draft.trim()}
          className="shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40"
        >
          {t("action.add")}
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <li
              key={value}
              className="flex items-center gap-1 rounded-full bg-blue-50 py-1 pr-1.5 pl-3 text-sm text-blue-800 ring-1 ring-blue-100"
            >
              <span className="max-w-60 truncate">{value}</span>
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-700"
                aria-label={`${t("action.remove")} ${value}`}
              >
                <Icon name="x" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs text-slate-400">{t("field.suggestions")}</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onAdd(s)}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-xs text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
              >
                <Icon name="plus" className="h-3 w-3" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
