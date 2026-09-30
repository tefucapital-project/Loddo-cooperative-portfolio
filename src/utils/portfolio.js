export function isMudarabah(item) {
  return String(item?.type || item?.investmentType || '').toLowerCase() === 'mudarabah';
}

export function isIjarah(item) {
  return String(item?.type || item?.investmentType || '').toLowerCase() === 'ijarah';
}

export function isActiveHolding(item) {
  const status = String(item?.status || '').toLowerCase();
  return ['active', 'pending', 'open', 'fully_funded', 'funded', 'leased', 'asset_purchased'].includes(status);
}

export function isCompletedHolding(item) {
  const status = String(item?.status || '').toLowerCase();
  return ['matured', 'completed', 'closed'].includes(status);
}

export function matchesHoldingStatus(item, filter) {
  if (!filter || filter === 'all') return true;
  const status = String(item?.status || '').toLowerCase();
  if (filter === 'active') return isActiveHolding(item);
  if (filter === 'completed') return isCompletedHolding(item);
  if (filter === 'pending') return status === 'pending';
  if (filter === 'cancelled') return status === 'cancelled';
  return status === filter;
}

export function summarizePortfolio({ holdings = [], wallet = null, profitDistributions = [] }) {
  const invested = holdings.reduce((sum, item) => sum + (Number(item.principal ?? item.amountInvested) || 0), 0);
  const recordedProfit = holdings.reduce(
    (sum, item) => sum + (Number(item.profitEarned ?? item.actualProfitEarned ?? item.actualRentalIncome) || 0),
    0
  );
  const distributedProfit = profitDistributions.reduce((sum, item) => sum + (Number(item.memberAmount) || 0), 0);
  const mudarabah = holdings.filter(isMudarabah);
  const ijarah = holdings.filter(isIjarah);
  const available = Number(wallet?.availableBalance ?? wallet?.mataanBalance ?? 0) || 0;
  const locked = Number(wallet?.sukkiniBalance ?? wallet?.reservedBalance ?? 0) || 0;
  const walletTotal = Number(wallet?.balance) || available + locked;

  return {
    totalValue: invested + walletTotal,
    invested,
    recordedProfit,
    distributedProfit,
    walletTotal,
    available,
    locked,
    activeCount: holdings.filter(isActiveHolding).length,
    mudarabahCount: mudarabah.filter(isActiveHolding).length,
    ijarahCount: ijarah.filter(isActiveHolding).length,
    mudarabahInvested: mudarabah.reduce((sum, item) => sum + (Number(item.principal ?? item.amountInvested) || 0), 0),
    ijarahInvested: ijarah.reduce((sum, item) => sum + (Number(item.principal ?? item.amountInvested) || 0), 0),
  };
}

const RANGE_MONTHS = { '1m': 1, '3m': 3, '6m': 6, '1y': 12, all: 18 };

export function buildPerformanceSeries(holdings = [], profitDistributions = [], range = '6m') {
  const events = [];
  holdings.forEach((item) => {
    if (!item.startDate) return;
    events.push({ date: new Date(item.startDate), invested: Number(item.principal ?? item.amountInvested) || 0, profit: 0 });
  });
  profitDistributions.forEach((item) => {
    if (!item.distributionDate) return;
    events.push({ date: new Date(item.distributionDate), invested: 0, profit: Number(item.memberAmount) || 0 });
  });
  const valid = events.filter((event) => !Number.isNaN(event.date.getTime()));
  if (valid.length < 2) return [];

  const months = RANGE_MONTHS[range] || 6;
  const end = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const start = new Date(end);
  start.setMonth(start.getMonth() - (months - 1));

  const buckets = [];
  for (let i = 0; i < months; i += 1) {
    const cursor = new Date(start.getFullYear(), start.getMonth() + i, 1);
    buckets.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`);
  }

  let invested = 0;
  let profit = 0;
  return buckets.map((key) => {
    valid.forEach((event) => {
      const eventKey = `${event.date.getFullYear()}-${String(event.date.getMonth() + 1).padStart(2, '0')}`;
      if (eventKey === key) {
        invested += event.invested;
        profit += event.profit;
      }
    });
    const [year, month] = key.split('-');
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-NG', {
      month: 'short',
      year: '2-digit',
    });
    return { month: label, value: invested + profit, invested, profit };
  });
}
