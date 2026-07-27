// Read-only render of the whole CV. Valid HTML, stable keys.
// This is the element that gets printed to PDF (see the print button in App).
export function Preview({ cv }) {
  const { personal } = cv;
  const contact = [personal.email, personal.tel, personal.location].filter(Boolean);

  return (
    <div id="cv-preview" className="mx-auto max-w-205 bg-white p-8 text-slate-800">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold">{personal.name || "Your Name"}</h2>
        {contact.length > 0 && (
          <p className="mt-1 text-sm text-slate-500">{contact.join("  •  ")}</p>
        )}
        {(personal.gender || personal.dob) && (
          <p className="text-sm text-slate-500">
            {[personal.gender, personal.dob].filter(Boolean).join("  •  ")}
          </p>
        )}
      </header>

      {cv.summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed">{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Experience">
          {cv.experience.map((x) => (
            <Entry
              key={x.id}
              heading={x.jobTitle}
              sub={x.company}
              meta={[x.location, dateRange(x.startDate, x.endDate)]}
              body={x.description}
            />
          ))}
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Education">
          {cv.education.map((x) => (
            <Entry
              key={x.id}
              heading={x.institution}
              sub={x.gpa ? `GPA: ${x.gpa}` : ""}
              meta={[x.location, dateRange(x.startDate, x.endDate)]}
            />
          ))}
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="Skills">
          <Tags items={cv.skills} />
        </Section>
      )}

      {personal.languages.length > 0 && (
        <Section title="Languages">
          <ul className="text-sm">
            {personal.languages.map((l) => (
              <li key={l.id}>
                {l.language}
                {l.level ? ` — ${l.level}` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {personal.hobbies.length > 0 && (
        <Section title="Hobbies">
          <Tags items={personal.hobbies} />
        </Section>
      )}

      {personal.links.length > 0 && (
        <Section title="Links">
          <ul className="text-sm">
            {personal.links.map((link) => (
              <li key={link} className="break-all text-blue-700">{link}</li>
            ))}
          </ul>
        </Section>
      )}

      {cv.references.length > 0 && (
        <Section title="References">
          {cv.references.map((r) => (
            <Entry key={r.id} heading={r.personName} sub={r.companyName} meta={[r.link]} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">{title}</h3>
      {children}
    </section>
  );
}

function Entry({ heading, sub, meta = [], body }) {
  const metaLine = meta.filter(Boolean).join("  •  ");
  return (
    <div className="mb-3">
      {heading && <p className="text-sm font-semibold">{heading}</p>}
      {sub && <p className="text-sm text-slate-600">{sub}</p>}
      {metaLine && <p className="text-xs text-slate-400">{metaLine}</p>}
      {body && <p className="mt-1 text-sm leading-relaxed">{body}</p>}
    </div>
  );
}

function Tags({ items }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded bg-slate-100 px-2 py-0.5 text-sm">{item}</span>
      ))}
    </div>
  );
}

function dateRange(start, end) {
  if (!start && !end) return "";
  return `${start || "?"} – ${end || "Present"}`;
}