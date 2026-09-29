// Shared form controls. All share one look so the editor feels consistent.
const CONTROL =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 " +
  "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 " +
  "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

export function CustomizedInput({ className = "", ...props }) {
  return <input className={`${CONTROL} ${className}`} {...props} />;
}

export function TextArea({ className = "", rows = 3, ...props }) {
  return <textarea rows={rows} className={`${CONTROL} resize-y ${className}`} {...props} />;
}

// options: [{ value, label }]; empty value shows `placeholder` as the prompt.
export function Select({ options, placeholder, className = "", ...props }) {
  return (
    <select className={`${CONTROL} ${className}`} {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// Label + control + optional hint. Wrapping in <label> links them without ids.
export function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-blue-600"
      />
      {label}
    </label>
  );
}
