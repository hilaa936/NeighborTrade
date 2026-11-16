// Simple prose layout for the terms and privacy pages
export default function LegalPage({ title, updated, children }) {
  return (
    <article className="page max-w-3xl">
      <h1 className="page-title">{title}</h1>
      <p className="mb-6 text-sm text-stone-500">{updated}</p>
      <div className="card space-y-4 p-6 leading-relaxed text-stone-700 [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-stone-900 [&_li]:ms-5 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </article>
  );
}
