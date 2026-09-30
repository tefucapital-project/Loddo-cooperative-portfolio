import { NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { NAV_ITEMS, isNavActive } from '../utils/nav.js';
import { ICON_MAP } from '../utils/iconMap.js';
import AppLogo from './AppLogo.jsx';

export default function Sidebar({ collapsed, onToggle, onLogout }) {
  const { pathname } = useLocation();

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/5 bg-brown-dark text-cream transition-all duration-300 md:flex ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center px-4 py-5">
        <AppLogo size="sm" withText={!collapsed} textClassName="text-cream" />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 no-scrollbar">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = isNavActive(item.to, pathname);
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    active ? 'bg-white/10 text-white' : 'text-cream/65 hover:bg-white/5 hover:text-cream'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-brand-gradient text-white' : 'bg-white/5'}`}>
                    <Icon size={16} />
                  </span>
                  {!collapsed && item.label}
                </NavLink>
                {!collapsed && item.children?.length ? (
                  <ul className="mt-1 ml-7 space-y-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = ICON_MAP[child.icon];
                      const childActive = isNavActive(child.to, pathname);
                      return (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${
                              childActive ? 'bg-white/10 text-white' : 'text-cream/55 hover:bg-white/5 hover:text-cream'
                            }`}
                          >
                            {ChildIcon ? <ChildIcon size={14} /> : null}
                            {child.label}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/5 p-3">
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5">
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
        <button type="button" onClick={onToggle} className="mt-2 flex w-full items-center justify-center rounded-xl border border-white/10 py-2 text-cream/60">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
