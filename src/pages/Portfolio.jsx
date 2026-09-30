import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Briefcase, CircleDollarSign, Download, Landmark, PiggyBank, TrendingUp, Wallet } from 'lucide-react';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import MetricCard from '../components/MetricCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { DEMO_INVESTMENTS, DEMO_PROFITS, DEMO_TRANSACTIONS, DEMO_WALLET } from '../data/demoData.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { buildPerformanceSeries, summarizePortfolio } from '../utils/portfolio.js';

const RANGES = [
  { id: '1m', label: '1 Month' },
  { id: '3m', label: '3 Months' },
  { id: '6m', label: '6 Months' },
  { id: '1y', label: '1 Year' },
  { id: 'all', label: 'All Time' },
];
const COLORS = ['#BE4D00', '#D97706', '#15803D'];

export default function Portfolio() {
  const [range, setRange] = useState('all');
  const summary = useMemo(
    () => summarizePortfolio({ holdings: DEMO_INVESTMENTS, wallet: DEMO_WALLET, profitDistributions: DEMO_PROFITS }),
    []
  );
  const series = useMemo(() => buildPerformanceSeries(DEMO_INVESTMENTS, DEMO_PROFITS, range), [range]);
  const investedTotal = summary.mudarabahInvested + summary.ijarahInvested;
  const slices = [
    { name: 'Mudarabah', value: summary.mudarabahInvested, color: COLORS[0] },
    { name: 'Ijarah', value: summary.ijarahInvested, color: COLORS[1] },
    { name: 'Available wallet', value: summary.available, color: COLORS[2] },
  ].filter((s) => s.value > 0);

  const downloadStatement = () => {
    const lines = [
      'Date,Type,Description,Amount,Direction,Reference,Status',
      ...DEMO_TRANSACTIONS.map((t) => [formatDate(t.createdAt), t.type, t.description, t.amount, t.direction, t.reference, t.status].join(',')),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loddo-member-statement.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="My Portfolio" subtitle="Track your savings, investments and profit distributions in one place." />
      <p className="mb-4 rounded-xl border border-gold/30 bg-highlight-gradient px-4 py-3 text-xs text-ink-muted">
        Demo mode: figures below are development samples for this portfolio app, not live cooperative records.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Briefcase} label="Total portfolio value" value={formatCurrency(summary.totalValue)} tone="highlight" />
        <MetricCard icon={Landmark} label="Total invested" value={formatCurrency(summary.invested)} />
        <MetricCard icon={CircleDollarSign} label="Distributed profit" value={formatCurrency(summary.distributedProfit)} />
        <MetricCard icon={Wallet} label="Wallet balance" value={formatCurrency(summary.walletTotal)} />
        <MetricCard icon={TrendingUp} label="Active investments" value={String(summary.activeCount)} />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Invested {formatCurrency(summary.invested)} · Recorded profit {formatCurrency(summary.recordedProfit)} · Available{' '}
        {formatCurrency(summary.available)} · Locked {formatCurrency(summary.locked)} · Mudarabah {summary.mudarabahCount} · Ijarah{' '}
        {summary.ijarahCount}. Profit shown is recorded and distributed only — not guaranteed.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-brown-dark">Portfolio performance</h2>
              <p className="text-xs text-ink-muted">Recorded investment activity and approved distributions only.</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${range === item.id ? 'bg-brand-gradient text-white' : 'border border-border-soft text-ink-muted'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {series.length ? (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7C675B' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, border: '1px solid #EAD8C4', fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="#BE4D00" fill="#FDE8C7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="Portfolio performance will appear once sufficient data is available." message="We only chart recorded activity." />
          )}
        </section>
        <section className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="text-sm font-bold text-brown-dark">Investment allocation</h2>
          <p className="text-xs text-ink-muted">Percentages of invested capital. Wallet funds are labelled separately.</p>
          <div className="mx-auto mt-2 h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3}>
                  {slices.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-ink-muted">Mudarabah ({investedTotal ? Math.round((summary.mudarabahInvested / investedTotal) * 100) : 0}% of invested)</span>
              <span className="font-semibold">{formatCurrency(summary.mudarabahInvested)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-ink-muted">Ijarah ({investedTotal ? Math.round((summary.ijarahInvested / investedTotal) * 100) : 0}% of invested)</span>
              <span className="font-semibold">{formatCurrency(summary.ijarahInvested)}</span>
            </li>
            <li className="flex justify-between border-t border-border-soft pt-2">
              <span className="text-ink-muted">Available wallet</span>
              <span className="font-semibold">{formatCurrency(summary.available)}</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-brown-dark">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Link to="/investments/mudarabah" className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white"><PiggyBank size={16} /></span>
            <span className="text-sm font-semibold">Explore investments</span>
          </Link>
          <Link to="/wallet/deposit" className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white"><Wallet size={16} /></span>
            <span className="text-sm font-semibold">Fund wallet</span>
          </Link>
          <Link to="/transactions" className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4 shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white"><ArrowRightLeft size={16} /></span>
            <span className="text-sm font-semibold">View transactions</span>
          </Link>
          <button type="button" onClick={downloadStatement} className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4 text-left shadow-soft">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white"><Download size={16} /></span>
            <span className="text-sm font-semibold">Download statements</span>
          </button>
        </div>
      </section>
    </div>
  );
}
