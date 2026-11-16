// Friendly placeholder for empty lists
export default function EmptyState({ icon = "🌱", title, hint, children }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
      <span className="text-4xl" aria-hidden>
        {icon}
      </span>
      <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
      {hint && <p className="max-w-sm text-sm text-stone-500">{hint}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
