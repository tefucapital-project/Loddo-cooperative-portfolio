export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-soft bg-cream/60 px-6 py-10 text-center">
      <h4 className="text-sm font-semibold text-brown-dark">{title}</h4>
      {message ? <p className="mt-1 text-sm text-ink-muted">{message}</p> : null}
    </div>
  );
}
