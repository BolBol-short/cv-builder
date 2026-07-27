import { CustomizedInput } from "./CustomizedInput";

// Handles an array of objects: experience, education, references, languages.
// `fields` describes the editable columns of one item, e.g.
//   [{ name: "jobTitle", placeholder: "Job title" }, { name: "description", type: "textarea" }]
// Parent supplies onAdd(), onUpdate(id, field, value), onRemove(id).
export function ObjectListField({ label, items, fields, onAdd, onUpdate, onRemove }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-lg border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          + Add
        </button>
      </div>

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-400">
          Nothing yet. Use “Add” to create an entry.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {fields.map((field) => {
                const value = item[field.name] ?? "";
                const onChange = (e) => onUpdate(item.id, field.name, e.target.value);
                const span = field.type === "textarea" ? "sm:col-span-2" : "";
                const listId = field.options ? `${item.id}-${field.name}` : undefined;
                return (
                  <div key={field.name} className={span}>
                    {field.type === "textarea" ? (
                      <textarea
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        rows={3}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={onChange}
                      />
                    ) : (
                      <>
                        <CustomizedInput
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={onChange}
                          list={listId}
                        />
                        {field.options && (
                          <datalist id={listId}>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt} />
                            ))}
                          </datalist>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}