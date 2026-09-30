import { FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { DEMO_DOCUMENTS } from '../data/demoData.js';

export default function Documents() {
  return (
    <div>
      <PageHeader title="Documents" subtitle="Agreements and certificates for your holdings" />
      <div className="space-y-2">
        {DEMO_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 rounded-2xl border border-border-soft bg-white p-4 shadow-soft">
            <FileText className="text-burnt" size={18} />
            <div>
              <p className="text-sm font-semibold">{doc.name}</p>
              <p className="text-xs text-ink-muted">{doc.reference}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
