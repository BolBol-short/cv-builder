import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { TEMPLATES } from "../templates";
import { makeT } from "../i18n/translations";

const MM = 96 / 25.4;              // px per mm @96dpi
const PAGE_W = 794;                // A4 width
const FIRST_PAGE_H = (297 - 10) * MM;      // page 1: bottom margin only (see index.css @page)
const NEXT_PAGE_H = (297 - 12 - 10) * MM;  // later pages: top + bottom margins

// y-offsets (unscaled px) where the printer will start a new page.
function pageBreaks(height) {
  const breaks = [];
  for (let y = FIRST_PAGE_H; y < height - 1; y += NEXT_PAGE_H) breaks.push(y);
  return breaks;
}

// Shell around the chosen template. Renders the page at true A4 size and
// scales it down to fit the column, so what you see is what prints.
// Also owns the accent-color CSS variable consumed by templates as (--accent),
// and marks where page breaks will fall.
export function Preview({ cv, settings }) {
  const Template = TEMPLATES[settings.template] ?? TEMPLATES.classic;
  const t = useMemo(() => makeT(settings.cvLang), [settings.cvLang]);
  const frameRef = useRef(null);
  const pageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(FIRST_PAGE_H);

  useLayoutEffect(() => {
    const measure = () => {
      const w = frameRef.current?.clientWidth ?? 0;
      if (w > 0) setScale(Math.min(1, w / PAGE_W));
      setHeight(pageRef.current?.offsetHeight ?? FIRST_PAGE_H);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frameRef.current);
    ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full">
      <div
        className="paper-frame relative mx-auto overflow-hidden bg-white shadow-xl ring-1 ring-slate-900/5"
        style={{ width: PAGE_W * scale, height: height * scale }}
      >
        <div
          ref={pageRef}
          lang={settings.cvLang}
          className="paper-scale absolute top-0 left-0 origin-top-left"
          style={{ transform: `scale(${scale})`, "--accent": settings.accentColor }}
        >
          <Template cv={cv} t={t} lang={settings.cvLang} />
        </div>

        {pageBreaks(height).map((y, i) => (
          <div
            key={i}
            className="no-print pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-rose-300"
            style={{ top: y * scale }}
          >
            <span className="absolute -top-2.5 right-2 rounded bg-rose-100 px-1.5 text-[10px] font-medium text-rose-600">
              {i + 2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
