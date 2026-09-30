import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { DEMO_CREDENTIALS } from '../data/demoData.js';
import AppLogo from '../components/AppLogo.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/portfolio" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email, password });
      navigate('/portfolio', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to log in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-welcome-gradient p-12 text-cream lg:flex lg:flex-col lg:justify-end">
        <AppLogo size="lg" withText={false} className="mb-auto" />
        <h2 className="font-display text-4xl font-semibold">Save securely. Invest ethically. Grow together.</h2>
        <p className="mt-4 max-w-md text-cream/80">
          Member portfolio for Loddo Multi-purpose Cooperative Society Limited. Track Mudarabah and Ijarah holdings without guaranteed-return claims.
        </p>
      </div>
      <div className="flex items-center justify-center bg-cream-light px-6 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-border-soft bg-white p-8 shadow-soft">
          <AppLogo size="md" className="mb-6" />
          <h1 className="text-2xl font-bold text-brown-dark">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-muted">Log in to your member portfolio.</p>
          <label className="mt-6 block text-sm font-medium text-brown-dark">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border-soft px-3 py-2.5 text-sm focus:border-burnt focus:outline-none"
              autoComplete="username"
              required
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-brown-dark">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border-soft px-3 py-2.5 text-sm focus:border-burnt focus:outline-none"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-xl bg-brand-gradient py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
