import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

const SOURCE = 'http://localhost:8030/api/ijarah/payment-cards';

function naira(value) {
  if (value == null || value === '') return '—';
  return `₦${Number(value).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PostedPaymentCards() {
  const { isPortfolioManager } = useAuth();
  const [cards, setCards] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch(SOURCE)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => setCards(payload?.data || []))
      .catch(() => setCards([]));
  };

  useEffect(() => {
    load();
  }, []);

  const onFile = async (file) => {
    setError('');
    setPreview(null);
    if (!file) return;
    setBusy(true);
    try {
      const fileBase64 = await readFile(file);
      const res = await fetch(SOURCE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true, fileName: file.name, fileBase64 }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || 'Could not read that card');
      setPreview(payload.data?.paymentCard || null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 space-y-3">
      {isPortfolioManager ? (
        <section className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-brown-dark">Attach payment history</p>
          <p className="mt-1 text-xs text-ink-muted">Posted only to the name printed on the card.</p>
          <input
            type="file"
            accept="application/pdf,image/*"
            className="mt-3 block text-sm"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {busy ? <p className="mt-2 text-sm text-ink-muted">Reading the card…</p> : null}
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        </section>
      ) : null}
      {preview ? <CardPost card={preview} /> : null}
      {cards.map((row) =>
        row.paymentCard ? <CardPost key={row.accountId} card={row.paymentCard} /> : null
      )}
    </div>
  );
}

function CardPost({ card }) {
  return (
    <div className="space-y-3">
      <ProgressCard card={card} />
      <DividendPost dividend={card.dividend} />
    </div>
  );
}

function DividendPost({ dividend }) {
  if (!dividend) return null;
  const history = dividend.history || [];
  const peak = Math.max(1, ...history.map((row) => Number(row.amount) || 0));
  return (
    <div className="space-y-3">
      <section className="grid overflow-hidden rounded-2xl border border-border-soft bg-white sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Current price" value={naira(dividend.currentPrice)} />
        <Fact label="Last dividend paid" value={dividend.lastDividend == null ? '—' : naira(dividend.lastDividend)} />
        <Fact label="Dividend yield" value={dividend.dividendYieldPct == null ? '—' : `${Number(dividend.dividendYieldPct).toFixed(2)}%`} />
        <Fact label="Last dividend qualification date" value={shortDate(dividend.lastQualificationDate)} />
        <Fact label="Last payment date" value={shortDate(dividend.lastPaymentDate)} />
      </section>
      <section className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-brown-dark">Dividend history</h2>
        <p className="mt-1 text-xs text-ink-muted">Dividends credited to this holding.</p>
        {history.length ? (
          <div className="mt-4 flex h-40 items-end gap-1 overflow-x-auto">
            {history.map((row) => (
              <div
                key={row.id}
                title={`Paid ${shortDate(row.paymentDate)} · qualified ${shortDate(row.qualificationDate)} · Dividend : ${naira(row.amount)}`}
                className="w-2 shrink-0 rounded-t bg-[#BE4D00]"
                style={{ height: `${Math.max(8, ((Number(row.amount) || 0) / peak) * 100)}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-muted">No dividends paid yet.</p>
        )}
      </section>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="border-b border-border-soft px-5 py-4 sm:border-r">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-brown-dark">{value}</p>
    </div>
  );
}

function shortDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

function ProgressCard({ card }) {
  const pct = Math.min(100, Math.max(0, Number(card.progressPct) || 0));
  return (
    <article className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">Progress</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <p className="font-display text-4xl tabular-nums text-brown-dark">{pct}%</p>
        <p className="text-sm font-semibold text-brown-dark">
          {Number(card.daysLeft) === 0 ? 'Completed' : `${card.daysLeft} days left`}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-cream">
        <div className="h-full rounded-full bg-brown-dark" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        {card.customerName}
        {card.code ? ` · ${card.code}` : ''} · {naira(card.paidAmount)} of {naira(card.openingBalance)}
      </p>
    </article>
  );
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.readAsDataURL(file);
  });
}
