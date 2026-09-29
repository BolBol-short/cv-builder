import { useRef } from "react";
import { Icon } from "./Icon";
import { useI18n } from "../i18n/I18nContext";

// Photo picker: upload (or camera capture on phones via accept="image/*").
// The image is resized on a <canvas> before it ever touches state — a phone
// camera produces multi-MB JPEGs, and base64 of that would blow the
// localStorage quota fast. Max edge 600px @ JPEG q0.85 ≈ tens of KB,
// still sharp at print size.
const MAX_EDGE = 600;

function resizeToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("error.image"));
    };
    img.src = url;
  });
}

export function PhotoPicker({ value, onChange }) {
  const { t } = useI18n();
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onChange(await resizeToDataUrl(file));
    } catch (err) {
      alert(t(err.message));
    }
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-28 w-22 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        aria-label={value ? t("action.changePhoto") : t("action.choosePhoto")}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-slate-400 group-hover:text-blue-600">
            <Icon name="user" className="h-7 w-7" strokeWidth={1.5} />
            {t("field.photo")}
          </span>
        )}
      </button>
      <div className="space-y-2">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          <Icon name="upload" />
          {value ? t("action.changePhoto") : t("action.choosePhoto")}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700"
          >
            <Icon name="trash" />
            {t("action.remove")}
          </button>
        )}
        <p className="text-xs text-slate-400">{t("field.photoHint")}</p>
      </div>
    </div>
  );
}
