import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { DEMO_DOCUMENTS, DEMO_INVESTMENTS, DEMO_MEMBER, DEMO_PROFITS } from '../data/demoData.js';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { isIjarah, isMudarabah } from '../utils/portfolio.js';

const TABS = ['Overview', 'Performance', 'Profit History', 'Documents', 'Agreement'];

export default function InvestmentDetail() {
  const { investmentId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const holding = DEMO_INVESTMENTS.find((item) => item.id === investmentId && item.memberId === DEMO_MEMBER.id);

  const distributions = useMemo(
    () => DEMO_PROFITS.filter((d) => d.investmentId === investmentId),
    [investmentId]
  );
  const docs = DEMO_DOCUMENTS.filter((d) => d.reference === holding?.reference);

  if (!holding) {
    return (
      <EmptyState
        title="Investment not found"
        message="You can only view investments that belong to this membership."
      />
    );
  }

  const mudarabah = isMudarabah(holding);
  const ijarah = isIjarah(holding);

  return (
    <div className="mx-auto max-w-3xl">
      <button type="button" onClick={() => navigate(ijarah ? '/investments/ijarah' : '/investments/mudarabah')} className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted">
        <ArrowLeft size={15} /> Back to {ijarah ? 'Ijarah' : 'Mudaraba'}
      </button>
      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-brown-dark">{holding.title}</h1>
            <p className="mt-1 text-xs capitalize text-ink-muted">{holding.type} · {holding.reference}</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full border border-border-soft bg-cream px-2.5 py-0.5 text-xs font-semibold capitalize">{holding.type}</span>
            <StatusBadge status={holding.status} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-cream/60 p-4 sm:grid-cols-4">
          <Field label="Amount invested" value={formatCurrency(holding.principal)} />
          <Field label="Actual profit credited" value={formatCurrency(holding.profitEarned)} success />
          <Field label="Start date" value={formatDate(holding.startDate)} />
          <Field label="Maturity date" value={formatDate(holding.maturityDate)} />
        </div>
        <div className="-mx-2 mt-6 overflow-x-auto px-2">
          <div className="flex min-w-max gap-2">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item ? 'bg-brand-gradient text-white' : 'border border-border-soft text-ink-muted'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4 text-sm text-ink-muted">
          {tab === 'Overview' && (
            <>
              {mudarabah && <p className="rounded-xl border border-gold/30 bg-highlight-gradient px-4 py-3">Profit is based on actual business performance and is not guaranteed.</p>}
              {ijarah && <p className="rounded-xl border border-gold/30 bg-highlight-gradient px-4 py-3">Rental income is shown only when credited through the approved workflow.</p>}
              <Section title={mudarabah ? 'Business overview' : 'Asset overview'}>{holding.description}</Section>
              {mudarabah && (
                <Section title="Investment terms">
                  Duration {holding.durationMonths} months · Profit-sharing ratio {holding.profitSharingRatio}% to member · Minimum {formatCurrency(holding.minInvestment)}
                </Section>
              )}
              {ijarah && (
                <>
                  <Section title="Lease details">Lease duration {holding.leaseDuration}. Purchase value {formatCurrency(holding.assetPurchaseValue)}.</Section>
                  <Section title="Maintenance and takaful">Maintenance and takaful terms follow the signed Ijarah agreement.</Section>
                </>
              )}
              <Section title="Investment status">This holding is currently {holding.status.toLowerCase()}.</Section>
            </>
          )}
          {tab === 'Performance' && (
            <>
              <p>Only recorded activity is shown. Projected or guaranteed returns are not displayed.</p>
              <Field label="Invested capital" value={formatCurrency(holding.principal)} />
              <Field label="Recorded profit" value={formatCurrency(holding.profitEarned)} />
            </>
          )}
          {tab === 'Profit History' &&
            (distributions.length ? (
              distributions.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border-soft p-3">
                  <div>
                    <p className="font-semibold text-brown-dark">{formatDate(d.distributionDate)}</p>
                    <p className="text-xs">Ref: {d.reference} · Distributed</p>
                  </div>
                  <span className="font-bold text-success">{formatCurrency(d.memberAmount)}</span>
                </div>
              ))
            ) : (
              <p>No approved profit distributions recorded yet.</p>
            ))}
          {tab === 'Documents' &&
            (docs.length ? (
              docs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-2 rounded-xl border border-border-soft p-3">
                  <FileText size={15} className="text-burnt" /> {doc.name}
                </div>
              ))
            ) : (
              <p>No documents attached yet.</p>
            ))}
          {tab === 'Agreement' && <Section title="Agreement">The signed terms for this {holding.type} investment remain on file with Loddo Cooperative.</Section>}
        </div>
        <button type="button" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border-soft py-3 text-sm font-semibold">
          <Download size={15} /> Download certificate
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, success }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className={`text-sm font-bold ${success ? 'text-success' : 'text-brown-dark'}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="mb-1 font-bold text-brown-dark">{title}</p>
      <p>{children}</p>
    </div>
  );
}
