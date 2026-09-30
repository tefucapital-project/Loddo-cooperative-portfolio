import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { DEMO_WALLET } from '../data/demoData.js';
import { formatCurrency } from '../utils/formatters.js';

export default function WalletPage() {
  return (
    <div>
      <PageHeader title="Wallet" subtitle="Available and locked balances for this membership" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Total" value={formatCurrency(DEMO_WALLET.balance)} />
        <Card label="Available" value={formatCurrency(DEMO_WALLET.availableBalance)} />
        <Card label="Locked / committed" value={formatCurrency(DEMO_WALLET.reservedBalance)} />
      </div>
      <Link to="/wallet/deposit" className="mt-6 inline-flex rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white">
        Fund wallet
      </Link>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
