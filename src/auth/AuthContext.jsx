import { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_CREDENTIALS, DEMO_MEMBER } from '../data/demoData.js';

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
    const emailOk = email.trim().toLowerCase() === DEMO_CREDENTIALS.email;
    const passwordOk = password === DEMO_CREDENTIALS.password;
    if (!emailOk || !passwordOk) {
      throw new Error('Invalid email or password.');
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_MEMBER));
    setMember(DEMO_MEMBER);
    return DEMO_MEMBER;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setMember(null);
  };

  const value = useMemo(() => ({ member, login, logout, isAuthenticated: Boolean(member) }), [member]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
