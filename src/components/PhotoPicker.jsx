import { useRef } from "react";

// Photo picker: upload (or camera capture on phones via accept="image/*").
// The image is resized on a <canvas> before it ever touches state — a phone
// camera produces multi-MB JPEGs, and base64 of that would blow the
// localStorage quota fast. Max edge 400px @ JPEG q0.85 ≈ tens of KB.
const MAX_EDGE = 400;

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
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}

export function PhotoPicker({ value, onChange }) {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onChange(await resizeToDataUrl(file));
    } catch (err) {
      alert(err.message);
    }
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <img
          src={value}
          alt="CV portrait"
          className="h-24 w-20 rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-24 w-20 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
          Photo
        </div>
      )}
      <div className="space-y-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="block rounded-lg border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          {value ? "Change photo" : "Choose photo"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="block text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
