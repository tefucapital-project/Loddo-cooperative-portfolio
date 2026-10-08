import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { getPageTitle } from '../utils/nav.js';
import { initialsFromName } from '../utils/formatters.js';

export default function Header({ onMenu, onLogout }) {
  const { member } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border-soft bg-cream-light/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button type="button" onClick={onMenu} className="rounded-lg p-2 text-brown-dark hover:bg-white md:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="text-base font-bold text-brown-dark sm:text-lg">{getPageTitle(location.pathname)}</h1>
        <div className="ml-auto flex items-center gap-2">
          {searchOpen ? (
            <input
              autoFocus
              aria-label="Search investments and transactions"
              placeholder="Search investments and transactions"
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const q = e.currentTarget.value.trim();
                setSearchOpen(false);
                if (!q) return;
                if (location.pathname.startsWith('/transactions')) navigate(`/transactions?q=${encodeURIComponent(q)}`);
                else navigate(`/investments/mudarabah?q=${encodeURIComponent(q)}`);
              }}
              onBlur={() => setSearchOpen(false)}
              className="w-44 rounded-xl border border-border-soft bg-white px-3 py-2 text-sm focus:border-burnt focus:outline-none sm:w-64"
            />
          ) : (
            <button type="button" onClick={() => setSearchOpen(true)} className="rounded-lg p-2 hover:bg-white" aria-label="Search">
              <Search size={18} />
            </button>
          )}
          <button type="button" className="rounded-lg p-2 hover:bg-white" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="relative" ref={menuRef}>
            <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                {initialsFromName(member?.fullName)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-brown-dark">{member?.fullName}</span>
                <span className="block text-xs text-ink-muted">{member?.accountType || 'Member'}</span>
              </span>
              <ChevronDown size={15} className="hidden text-ink-muted sm:block" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-border-soft bg-white shadow-lifted">
                <button type="button" onClick={() => { setOpen(false); navigate('/settings'); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream">
                  <User size={15} /> Profile
                </button>
                <button type="button" onClick={() => { setOpen(false); onLogout(); }} className="flex w-full items-center gap-2 border-t border-border-soft px-4 py-2.5 text-sm text-danger hover:bg-red-50">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
