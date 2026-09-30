export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  const styles = {
    active: 'bg-green-50 text-success border-green-200',
    paid: 'bg-green-50 text-success border-green-200',
    successful: 'bg-green-50 text-success border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-sky-50 text-info border-sky-200',
    cancelled: 'bg-red-50 text-danger border-red-200',
  };
  const style = styles[key] || 'bg-gray-100 text-ink-muted border-gray-200';
  const label = key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}
