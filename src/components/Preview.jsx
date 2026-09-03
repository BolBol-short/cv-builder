import { Classic } from "../templates/Classic";

// Shell around the chosen template. Owns the accent-color CSS variable so
// every template can consume it via Tailwind arbitrary values like
// text-[var(--accent)] without knowing where the color came from.
export function Preview({ cv, accentColor }) {
  return (
    <div style={{ "--accent": accentColor }}>
      <Classic cv={cv} />
    </div>
  );
}
