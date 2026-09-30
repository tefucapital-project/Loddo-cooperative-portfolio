import PageHeader from '../components/PageHeader.jsx';

export default function Deposit() {
  return (
    <div>
      <PageHeader title="Fund wallet" subtitle="Deposits are processed through the cooperative’s approved channels." />
      <p className="rounded-2xl border border-border-soft bg-white p-6 text-sm text-ink-muted shadow-soft">
        This portfolio app does not process live payments. Use the member app deposit flow when you are ready to fund a real wallet.
      </p>
    </div>
  );
}
