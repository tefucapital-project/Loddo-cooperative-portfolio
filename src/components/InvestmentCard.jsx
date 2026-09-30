import { Link } from 'react-router-dom';
import { Building2, HandCoins } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatCurrency, formatDate, daysUntil } from '../utils/formatters.js';
import { isMudarabah } from '../utils/portfolio.js';

export default function InvestmentCard({ investment }) {
  const mudarabah = isMudarabah(investment);
  const days = daysUntil(investment.maturityDate);
  return (
    <article className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
            {mudarabah ? <HandCoins size={17} /> : <Building2 size={17} />}
          </span>
          <div>
            <p className="text-sm font-semibold text-brown-dark">{investment.title || investment.assetName}</p>
            <p className="text-xs capitalize text-ink-muted">{investment.type} · {investment.reference}</p>
          </div>
        </div>
        <StatusBadge status={investment.status} />
      </div>
      {investment.description ? <p className="mt-3 line-clamp-2 text-xs text-ink-muted">{investment.description}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-ink-muted">Invested amount</p>
          <p className="text-base font-bold">{formatCurrency(investment.principal)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">{mudarabah ? 'Actual profit earned' : 'Rental / profit credited'}</p>
          <p className="text-base font-bold text-success">{investment.profitEarned ? formatCurrency(investment.profitEarned) : '—'}</p>
        </div>
        {mudarabah && investment.profitSharingRatio ? (
          <div>
            <p className="text-xs text-ink-muted">Profit-sharing ratio</p>
            <p className="text-sm font-semibold">{investment.profitSharingRatio}%</p>
          </div>
        ) : null}
        {!mudarabah && investment.assetType ? (
          <div>
            <p className="text-xs text-ink-muted">Asset type</p>
            <p className="text-sm font-semibold">{investment.assetType}</p>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Started {formatDate(investment.startDate)} · {days > 0 ? `${days} days to maturity` : 'Matured'}
      </p>
      <Link to={`/investments/${investment.id}`} className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-border-soft py-2.5 text-sm font-semibold">
        View details
      </Link>
    </article>
  );
}
