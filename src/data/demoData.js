/** Development-mode sample data for this portfolio app only. Not live member records. */

export const DEMO_CREDENTIALS = {
  email: 'portfolio@loddocoop.com',
  password: 'Admin123!',
};

export const DEMO_MEMBER = {
  id: 'member_portfolio',
  fullName: 'Portfolio Member',
  email: DEMO_CREDENTIALS.email,
  membershipNumber: 'LDC-2026-0099',
  accountType: 'Member',
};

export const DEMO_WALLET = {
  balance: 450000,
  availableBalance: 450000,
  reservedBalance: 0,
  mataanBalance: 450000,
  sukkiniBalance: 0,
};

export const DEMO_INVESTMENTS = [
  {
    id: 'investment_mudarabah_001',
    memberId: DEMO_MEMBER.id,
    investmentType: 'MUDARABAH',
    type: 'mudarabah',
    title: 'Halal Trade Business',
    description: 'Wholesale trade partnership managed under a Mudarabah structure.',
    amountInvested: 1500000,
    principal: 1500000,
    actualProfitEarned: 72000,
    profitEarned: 72000,
    status: 'ACTIVE',
    startDate: '2025-06-12',
    maturityDate: '2026-06-12',
    reference: 'INV-001',
    profitSharingRatio: 70,
    minInvestment: 50000,
    durationMonths: 12,
  },
  {
    id: 'investment_ijarah_001',
    memberId: DEMO_MEMBER.id,
    investmentType: 'IJARAH',
    type: 'ijarah',
    title: 'Commercial Property',
    assetName: 'Commercial Property',
    assetType: 'Property',
    assetDescription: 'Lease of a commercial unit. Rental is recorded after collection and approval.',
    description: 'Lease of a commercial unit. Rental is recorded after collection and approval.',
    amountInvested: 800000,
    principal: 800000,
    actualRentalIncome: 38000,
    profitEarned: 38000,
    status: 'ACTIVE',
    startDate: '2025-07-20',
    maturityDate: '2027-07-20',
    reference: 'INV-002',
    leaseDuration: '24 months',
    assetPurchaseValue: 12000000,
  },
];

export const DEMO_PROFITS = [
  {
    id: 'prf_001',
    investmentId: 'investment_mudarabah_001',
    opportunityTitle: 'Halal Trade Business',
    type: 'mudarabah',
    grossIncome: 120000,
    approvedExpenses: 18000,
    netDistributable: 102000,
    memberAmount: 72000,
    cooperativeShare: 30000,
    distributionDate: '2026-03-15',
    reference: 'PRF-001',
    status: 'paid',
  },
  {
    id: 'prf_002',
    investmentId: 'investment_ijarah_001',
    opportunityTitle: 'Commercial Property',
    type: 'ijarah',
    grossIncome: 50000,
    approvedExpenses: 4000,
    netDistributable: 46000,
    memberAmount: 38000,
    cooperativeShare: 8000,
    distributionDate: '2026-08-10',
    reference: 'PRF-002',
    status: 'paid',
  },
];

export const DEMO_TRANSACTIONS = [
  {
    id: 'txn_001',
    type: 'deposit',
    description: 'Wallet funding',
    amount: 450000,
    direction: 'credit',
    status: 'successful',
    reference: 'TXN-001',
    createdAt: '2025-06-02T09:00:00.000Z',
  },
  {
    id: 'txn_002',
    type: 'investment',
    description: 'Investment: Halal Trade Business',
    amount: 1500000,
    direction: 'debit',
    status: 'successful',
    reference: 'INV-001',
    createdAt: '2025-06-12T10:00:00.000Z',
  },
  {
    id: 'txn_003',
    type: 'profit',
    description: 'Approved profit distribution',
    amount: 72000,
    direction: 'credit',
    status: 'successful',
    reference: 'PRF-001',
    createdAt: '2026-03-15T12:00:00.000Z',
  },
];

export const DEMO_DOCUMENTS = [
  {
    id: 'doc_001',
    name: 'Mudarabah Agreement — Halal Trade Business',
    type: 'mudarabah_agreement',
    reference: 'INV-001',
  },
  {
    id: 'doc_002',
    name: 'Ijarah Agreement — Commercial Property',
    type: 'ijarah_agreement',
    reference: 'INV-002',
  },
];
