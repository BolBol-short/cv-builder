import { CustomizedInput, TextArea, Select, Field, Checkbox } from "./CustomizedInput";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";

// Handles an array of objects: experience, education, references, languages, certifications.
// `fields` describes the editable columns of one item, e.g.
//   { name: "jobTitle", label: "Position" }
//   { name: "description", label, type: "textarea", hint }
//   { name: "level", label, type: "select", options: [{ value, label }] }
//   { name: "language", label, suggestions: ["Khmer", …] }        → <datalist>
//   { name: "current", label, type: "checkbox" }
//   { name: "endDate", type: "month", disabled: (item) => item.current }
// `titleOf(item)` gives the card heading. Parent supplies
// onAdd(), onUpdate(id, field, value), onRemove(id), onMove(id, dir).
export function ObjectListField({ items, fields, titleOf, onAdd, onUpdate, onRemove, onMove, addLabel }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-center text-sm text-slate-400">
          {t("field.empty")}
        </p>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              {index + 1}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
              {titleOf?.(item) || <span className="text-slate-400">{t("field.untitled")}</span>}
            </p>
            <IconButton icon="up" label={t("action.moveUp")} disabled={index === 0}
              onClick={() => onMove(item.id, -1)} />
            <IconButton icon="down" label={t("action.moveDown")} disabled={index === items.length - 1}
              onClick={() => onMove(item.id, 1)} />
            <IconButton icon="trash" label={t("action.remove")} danger
              onClick={() => onRemove(item.id)} />
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldControl key={field.name} field={field} item={item}
                onChange={(value) => onUpdate(item.id, field.name, value)} />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-blue-200 py-2.5 text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50"
      >
        <Icon name="plus" />
        {addLabel ?? t("action.addEntry")}
      </button>
    </div>
  );
}

function FieldControl({ field, item, onChange }) {
  const value = item[field.name] ?? "";
  const disabled = field.disabled?.(item) ?? false;
  const wide = field.type === "textarea" || field.type === "checkbox" || field.wide;

  if (field.type === "checkbox") {
    return (
      <div className="sm:col-span-2">
        <Checkbox label={field.label} checked={Boolean(item[field.name])} onChange={onChange} />
      </div>
    );
  }

  let control;
  if (field.type === "textarea") {
    control = <TextArea rows={4} placeholder={field.placeholder} value={value}
      onChange={(e) => onChange(e.target.value)} />;
  } else if (field.type === "select") {
    control = <Select options={field.options} placeholder={field.placeholder ?? "…"} value={value}
      onChange={(e) => onChange(e.target.value)} />;
  } else {
    const listId = field.suggestions ? `${item.id}-${field.name}-list` : undefined;
    control = (
      <>
        <CustomizedInput type={field.type ?? "text"} placeholder={field.placeholder} value={value}
          disabled={disabled} list={listId} onChange={(e) => onChange(e.target.value)} />
        {listId && (
          <datalist id={listId}>
            {field.suggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
        )}
      </>
    );
  }

  return (
    <Field label={field.label} hint={field.hint} className={wide ? "sm:col-span-2" : ""}>
      {control}
    </Field>
  );
}

function IconButton({ icon, label, onClick, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`rounded-md p-1.5 disabled:opacity-30 ${
        danger ? "text-slate-400 hover:bg-red-50 hover:text-red-600" : "text-slate-400 hover:bg-white hover:text-slate-700"
      }`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}
