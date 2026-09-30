export const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Portfolio', to: '/portfolio', icon: 'Briefcase' },
  {
    label: 'Invest',
    to: '/investments',
    icon: 'TrendingUp',
    children: [
      { label: 'Mudaraba', to: '/investments/mudarabah', icon: 'HandCoins' },
      { label: 'Ijarah', to: '/investments/ijarah', icon: 'Building2' },
    ],
  },
  { label: 'Wallet', to: '/wallet', icon: 'Wallet' },
  { label: 'Transactions', to: '/transactions', icon: 'ReceiptText' },
  { label: 'Profit History', to: '/profit-history', icon: 'HandCoins' },
  { label: 'Documents', to: '/documents', icon: 'FileText' },
  { label: 'Settings', to: '/settings', icon: 'Settings' },
];

export function isNavActive(to, pathname) {
  if (to === '/dashboard') return pathname === '/dashboard';
  if (to === '/portfolio') return pathname === '/portfolio';
  if (to === '/investments/mudarabah') return pathname.startsWith('/investments/mudarabah');
  if (to === '/investments/ijarah') return pathname.startsWith('/investments/ijarah');
  if (to === '/investments') return pathname.startsWith('/investments');
  if (to === '/wallet') return pathname.startsWith('/wallet') || pathname === '/deposit';
  if (to === '/transactions') return pathname.startsWith('/transactions');
  if (to === '/profit-history') return pathname.startsWith('/profit-history');
  if (to === '/documents') return pathname.startsWith('/documents');
  if (to === '/settings') return pathname.startsWith('/settings');
  return false;
}

export function getPageTitle(pathname) {
  if (pathname.startsWith('/investments/mudarabah')) return 'Mudaraba';
  if (pathname.startsWith('/investments/ijarah')) return 'Ijarah';
  if (pathname.startsWith('/investments/') && pathname !== '/investments/explore') return 'Investment Details';
  if (pathname.startsWith('/investments/explore')) return 'Explore Investments';
  if (pathname.startsWith('/investments')) return 'Invest';
  if (pathname.startsWith('/profit-history')) return 'Profit History';
  if (pathname.startsWith('/wallet') || pathname === '/deposit') return 'Wallet';
  if (pathname.startsWith('/transactions')) return 'Transactions';
  if (pathname.startsWith('/documents')) return 'Documents';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/portfolio')) return 'My Portfolio';
  return 'Loddo Cooperative';
}
