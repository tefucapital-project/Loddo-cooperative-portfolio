import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import AppLogo from '../components/AppLogo.jsx';
import { NAV_ITEMS, isNavActive } from '../utils/nav.js';
import { ICON_MAP } from '../utils/iconMap.js';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const [drawer, setDrawer] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-cream-light">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} onLogout={handleLogout} />
      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-72 bg-brown-dark p-4 text-cream">
            <div className="mb-4">
              <AppLogo size="sm" textClassName="text-cream" />
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const active = isNavActive(item.to, location.pathname);
              return (
                <div key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={item.children?.length ? undefined : () => setDrawer(false)}
                    className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active ? 'bg-white/10 text-white' : 'text-cream/70'}`}
                  >
                    <Icon size={16} /> {item.label}
                  </NavLink>
                  {item.children?.length ? (
                    <div className="mb-2 ml-7 border-l border-white/10 pl-3">
                      {item.children.map((child) => {
                        const ChildIcon = ICON_MAP[child.icon];
                        const childActive = isNavActive(child.to, location.pathname);
                        return (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setDrawer(false)}
                            className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-sm ${childActive ? 'bg-white/10 text-white' : 'text-cream/55'}`}
                          >
                            {ChildIcon ? <ChildIcon size={14} /> : null}
                            {child.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setDrawer(true)} onLogout={handleLogout} />
        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border-soft bg-white/95 md:hidden">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = isNavActive(item.to, location.pathname);
            return (
              <NavLink key={item.to} to={item.to} className={`flex flex-1 flex-col items-center py-2.5 text-[11px] ${active ? 'text-burnt' : 'text-ink-muted'}`}>
                <Icon size={18} />
                {item.label.split(' ')[0]}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
