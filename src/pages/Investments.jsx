import { useMemo } from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import InvestmentCard from '../components/InvestmentCard.jsx';
import { DEMO_INVESTMENTS } from '../data/demoData.js';
import { isIjarah, isMudarabah, matchesHoldingStatus } from '../utils/portfolio.js';
import PostedPaymentCards from '../components/PostedPaymentCards.jsx';

const TYPE_TABS = [
  { id: 'mudarabah', label: 'Mudaraba', to: '/investments/mudarabah' },
  { id: 'ijarah', label: 'Ijarah', to: '/investments/ijarah' },
];
const STATUSES = ['all', 'active', 'completed', 'pending', 'cancelled'];

export default function Investments() {
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const tab = pathname.includes('/ijarah') ? 'ijarah' : 'mudarabah';
  const status = params.get('status') || 'all';
  const search = params.get('q') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || (key !== 'q' && value === 'all')) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_INVESTMENTS.filter((item) => {
      if (tab === 'mudarabah' && !isMudarabah(item)) return false;
      if (tab === 'ijarah' && !isIjarah(item)) return false;
      if (!matchesHoldingStatus(item, status)) return false;
      if (!q) return true;
      return String(item.title || item.assetName).toLowerCase().includes(q) || String(item.reference).toLowerCase().includes(q);
    });
  }, [tab, status, search]);

  return (
    <div>
      <PageHeader
        title={tab === 'ijarah' ? 'Ijarah' : 'Mudaraba'}
        subtitle={
          tab === 'ijarah'
            ? 'Your Ijarah holdings with Loddo Cooperative'
            : 'Your Mudaraba holdings with Loddo Cooperative'
        }
        actions={
          <Link to="/investments/explore" className="rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white">
            Explore investments
          </Link>
        }
      />
      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex min-w-max gap-2" role="tablist">
          {TYPE_TABS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              role="tab"
              aria-selected={tab === item.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item.id ? 'bg-brand-gradient text-white' : 'border border-border-soft bg-white text-ink-muted'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      {tab === 'mudarabah' && (
        <p className="mb-4 rounded-xl border border-gold/30 bg-highlight-gradient px-4 py-3 text-sm text-ink-muted">
          Profit is based on actual business performance and is not guaranteed.
        </p>
      )}
      {tab === 'ijarah' && (
        <>
          <p className="mb-4 rounded-xl border border-gold/30 bg-highlight-gradient px-4 py-3 text-sm text-ink-muted">
            Rental income is recorded only after it is received and approved.
          </p>
          <PostedPaymentCards />
        </>
      )}
      <input
        value={search}
        onChange={(e) => setParam('q', e.target.value)}
        placeholder="Search by title or reference"
        className="mb-3 w-full max-w-sm rounded-xl border border-border-soft px-3 py-2.5 text-sm focus:border-burnt focus:outline-none"
      />
      <div className="mb-4 flex flex-wrap gap-1">
        {STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setParam('status', item)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${status === item ? 'bg-brown-dark text-cream' : 'border border-border-soft text-ink-muted'}`}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((investment) => (
            <InvestmentCard key={investment.id} investment={investment} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={tab === 'ijarah' ? 'No Ijarah investments yet' : 'No Mudaraba investments yet'}
          message="Holdings of this type will appear here once you invest."
        />
      )}
    </div>
  );
}
