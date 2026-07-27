import { useState } from "react";
import { CustomizedInput } from "./CustomizedInput";

// Handles a single string array: skills, hobbies, links.
// Owns its own scratch input; calls onAdd(value) / onRemove(value) on the parent.
// `options` (optional) feeds a <datalist> of suggestions.
export function StringListField({ label, placeholder, values, onAdd, onRemove, options }) {
  const [draft, setDraft] = useState("");
  const listId = options ? `${label.replace(/\s+/g, "-").toLowerCase()}-options` : undefined;

  const commit = () => {
    onAdd(draft);
    setDraft("");
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        <CustomizedInput
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          list={listId}
        />
        <button
          type="button"
          onClick={commit}
          className="shrink-0 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800"
        >
          Add
        </button>
      </div>
      {options && (
        <datalist id={listId}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      )}
      {values.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <li
              key={value}
              className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800"
            >
              {value}
              <button
                type="button"
                onClick={() => onRemove(value)}
                className="text-blue-400 hover:text-blue-700"
                aria-label={`Remove ${value}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}