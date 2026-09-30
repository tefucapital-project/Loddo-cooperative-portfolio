import { useMemo, useState } from 'react';
import { Building2, Calendar, CircleDollarSign, HandCoins } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MetricCard from '../components/MetricCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { DEMO_PROFITS } from '../data/demoData.js';
import { formatCurrency, formatDate, percentage } from '../utils/formatters.js';

export default function ProfitHistory() {
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_PROFITS.filter((d) => {
      if (type !== 'all' && d.type !== type) return false;
      if (!q) return true;
      return d.opportunityTitle.toLowerCase().includes(q) || d.reference.toLowerCase().includes(q);
    });
  }, [type, search]);

  const total = DEMO_PROFITS.reduce((s, d) => s + d.memberAmount, 0);
  const mudarabah = DEMO_PROFITS.filter((d) => d.type === 'mudarabah').reduce((s, d) => s + d.memberAmount, 0);
  const ijarah = DEMO_PROFITS.filter((d) => d.type === 'ijarah').reduce((s, d) => s + d.memberAmount, 0);

  return (
    <div>
      <PageHeader title="Profit History" subtitle="Approved distributions from Mudarabah and Ijarah holdings" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={CircleDollarSign} label="Total profit distributed" value={formatCurrency(total)} tone="highlight" />
        <MetricCard icon={HandCoins} label="Mudarabah profit" value={formatCurrency(mudarabah)} />
        <MetricCard icon={Building2} label="Ijarah rental income" value={formatCurrency(ijarah)} />
        <MetricCard icon={Calendar} label="Current period profit" value={formatCurrency(0)} />
      </div>
      <p className="mt-2 text-xs text-ink-muted">Amounts are distributed profit only. Projected profit is not shown.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search investment or reference" className="w-full rounded-xl border border-border-soft px-3 py-2.5 text-sm sm:max-w-xs" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-border-soft px-3 py-2.5 text-sm">
          <option value="all">All types</option>
          <option value="mudarabah">Mudarabah</option>
          <option value="ijarah">Ijarah</option>
        </select>
      </div>
      {filtered.length ? (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border-soft bg-white lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream/60 text-xs uppercase text-ink-muted">
                <tr>
                  {['Date', 'Investment', 'Type', 'Gross', 'Expenses', 'Net', 'Member share', 'Cooperative share', 'Reference', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="cursor-pointer border-t border-border-soft hover:bg-cream/40" onClick={() => setSelected(d)}>
                    <td className="px-4 py-3">{formatDate(d.distributionDate)}</td>
                    <td className="px-4 py-3 font-medium">{d.opportunityTitle}</td>
                    <td className="px-4 py-3 capitalize">{d.type}</td>
                    <td className="px-4 py-3">{formatCurrency(d.grossIncome)}</td>
                    <td className="px-4 py-3">{formatCurrency(d.approvedExpenses)}</td>
                    <td className="px-4 py-3">{formatCurrency(d.netDistributable)}</td>
                    <td className="px-4 py-3 font-semibold text-success">{formatCurrency(d.memberAmount)}</td>
                    <td className="px-4 py-3">{formatCurrency(d.cooperativeShare)}</td>
                    <td className="px-4 py-3 text-xs">{d.reference}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 lg:hidden">
            {filtered.map((d) => (
              <button key={d.id} type="button" onClick={() => setSelected(d)} className="rounded-2xl border border-border-soft bg-white p-4 text-left shadow-soft">
                <p className="text-sm font-semibold">{d.opportunityTitle}</p>
                <p className="text-xs capitalize text-ink-muted">{d.type} · {formatDate(d.distributionDate)}</p>
                <p className="mt-2 text-lg font-bold text-success">{formatCurrency(d.memberAmount)}</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4"><EmptyState title="No distributions found" message="Approved profit distributions will appear here." /></div>
      )}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lifted" onClick={(e) => e.stopPropagation()}>
            <p className="text-2xl font-bold text-success">{formatCurrency(selected.memberAmount)}</p>
            <p className="mt-1 text-xs text-ink-muted">Distributed profit, not a projection. Member participation {percentage(selected.memberAmount, selected.netDistributable)}%.</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Investment" value={selected.opportunityTitle} />
              <Row label="Gross income" value={formatCurrency(selected.grossIncome)} />
              <Row label="Approved expenses" value={formatCurrency(selected.approvedExpenses)} />
              <Row label="Net distributable" value={formatCurrency(selected.netDistributable)} />
              <Row label="Loddo Cooperative share" value={formatCurrency(selected.cooperativeShare)} />
              <Row label="Reference" value={selected.reference} />
            </dl>
            <button type="button" onClick={() => setSelected(null)} className="mt-4 w-full rounded-xl border py-2 text-sm font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-brown-dark">{value}</dd>
    </div>
  );
}
