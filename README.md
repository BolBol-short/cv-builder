Project Title:
CV-Builder (Cambodia Based)

Stack : 
React.js, Tailwind.css, JS

Objective :
Make a fully frontend website where user can create their own personal work CV (Curriculum Vitae)

Motivation :
Some people don't have time to do it, some doesn't where to create one, and some, like me, need instructions on where to complete.

Start Date :
23rd / July / 2026

Terms of Use :
Uses to make CV. Any inappropriate uses will not fall on me.
# cv-builder
This project is for creating a CV(Curriculum Vitae). This type of CV typically used in Southeast Asia (preferably Cambodia). This project is intended to be used by all who want to create and design their own personal CV, as it provides form to complete personal information and color palettes to choose from.

## Features
- English and Khmer (ខ្មែរ) interface. The CV language is set separately, so you can use a Khmer interface to write an English CV.
- Five templates: Classic, Modern, Professional, Minimal and Traditional (formal Cambodian "ប្រវត្តិរូបសង្ខេប" layout).
- Accent color presets plus a custom color picker.
- Sections: personal details (photo, date/place of birth, nationality, marital status), summary, work experience, education, certificates & training, skills, languages, hobbies, links, references.
- One-click suggestions for skills, hobbies and languages; reorder entries; "currently work/study here".
- Live A4 preview that matches the printed PDF, with page-break markers.
- Auto-save in the browser, save/open the CV as a JSON file, load an example CV.

## Development
```
npm install
npm run dev      # start dev server
npm run build    # production build
npm run lint
```

To get a PDF: click **Download PDF**, choose "Save as PDF", paper size A4, and turn off "Headers and footers".

## Project layout
- `v1/src/components/` — editor UI (header, content editor, design panel, preview)
- `v1/src/templates/` — CV templates; add a new one to `templates/index.js` and `templates/templateIds.js` (inside `v1/src/`)
- `v1/src/i18n/translations.js` — all UI and CV text in English and Khmer
- `v1/src/constants/` — suggestion lists, color presets, example CVs
- `v1/src/utils/` — CV data helpers, date formatting, file import/export
