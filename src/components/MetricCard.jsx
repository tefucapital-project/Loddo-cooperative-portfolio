import { motion } from 'framer-motion';

export default function MetricCard({ icon: Icon, label, value, tone = 'default' }) {
  const highlight = tone === 'highlight';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-soft ${highlight ? 'border-gold/30 bg-highlight-gradient' : 'border-border-soft bg-white'}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
        <Icon size={17} />
      </span>
      <p className="mt-3 text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-brown-dark sm:text-2xl">{value}</p>
    </motion.div>
  );
}
