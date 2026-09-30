import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { DEMO_INVESTMENTS, DEMO_WALLET } from '../data/demoData.js';
import { formatCurrency } from '../utils/formatters.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Dashboard() {
  const { member } = useAuth();
  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome, ${member?.fullName}.`} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
          <p className="text-xs text-ink-muted">Wallet</p>
          <p className="mt-1 text-2xl font-bold">{formatCurrency(DEMO_WALLET.balance)}</p>
        </div>
        <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-soft">
          <p className="text-xs text-ink-muted">Active holdings</p>
          <p className="mt-1 text-2xl font-bold">{DEMO_INVESTMENTS.length}</p>
        </div>
      </div>
      <Link to="/portfolio" className="mt-6 inline-flex rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white">
        Open portfolio
      </Link>
    </div>
  );
}
