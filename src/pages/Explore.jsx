import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Explore() {
  return (
    <div>
      <PageHeader title="Explore investments" subtitle="Open Mudarabah and Ijarah plans" />
      <EmptyState title="No open plans in this demo" message="Live plans are published in the member investment marketplace." />
    </div>
  );
}
