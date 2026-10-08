import { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_CREDENTIALS, DEMO_MANAGER, DEMO_MEMBER, MEMBER_CREDENTIALS } from '../data/demoData.js';

const SESSION_KEY = 'loddo_portfolio_session';
const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [member, setMember] = useState(readSession);

  const login = async ({ email, password }) => {
    const normalized = email.trim().toLowerCase();
    const match = [
      { email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password, user: DEMO_MANAGER },
      { email: MEMBER_CREDENTIALS.email, password: MEMBER_CREDENTIALS.password, user: DEMO_MEMBER },
    ].find((row) => row.email === normalized && row.password === password);
    if (!match) {
      throw new Error('Invalid email or password.');
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(match.user));
    setMember(match.user);
    return match.user;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setMember(null);
  };

  const value = useMemo(
    () => ({
      member,
      login,
      logout,
      isAuthenticated: Boolean(member),
      isPortfolioManager: member?.role === 'portfolio_manager',
    }),
    [member]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
