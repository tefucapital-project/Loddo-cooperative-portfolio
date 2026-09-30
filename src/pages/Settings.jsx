import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Settings() {
  const { member } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Membership profile" />
      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-soft">
        <p className="text-sm"><span className="text-ink-muted">Name:</span> {member?.fullName}</p>
        <p className="mt-2 text-sm"><span className="text-ink-muted">Email:</span> {member?.email}</p>
        <p className="mt-2 text-sm"><span className="text-ink-muted">Account type:</span> Member</p>
        <p className="mt-2 text-sm"><span className="text-ink-muted">Membership number:</span> {member?.membershipNumber}</p>
      </div>
    </div>
  );
}
