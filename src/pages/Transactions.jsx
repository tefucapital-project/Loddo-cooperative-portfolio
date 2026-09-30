import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { DEMO_TRANSACTIONS } from '../data/demoData.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export default function Transactions() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_TRANSACTIONS.filter((t) => !q || `${t.description} ${t.reference} ${t.type}`.toLowerCase().includes(q));
  }, [search]);

  return (
    <div>
      <PageHeader title="Transactions" subtitle="Wallet activity for this membership" />
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions" className="mb-4 w-full max-w-sm rounded-xl border border-border-soft px-3 py-2.5 text-sm" />
      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border-soft bg-white p-4 shadow-soft">
            <div>
              <p className="text-sm font-semibold">{t.description}</p>
              <p className="text-xs text-ink-muted">{formatDate(t.createdAt)} · {t.reference}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${t.direction === 'credit' ? 'text-success' : 'text-brown-dark'}`}>
                {t.direction === 'credit' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </p>
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
