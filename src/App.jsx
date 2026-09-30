import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Investments from './pages/Investments.jsx';
import InvestmentDetail from './pages/InvestmentDetail.jsx';
import ProfitHistory from './pages/ProfitHistory.jsx';
import WalletPage from './pages/Wallet.jsx';
import Deposit from './pages/Deposit.jsx';
import Transactions from './pages/Transactions.jsx';
import Documents from './pages/Documents.jsx';
import Settings from './pages/Settings.jsx';
import Explore from './pages/Explore.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/investments" element={<Navigate to="/investments/mudarabah" replace />} />
            <Route path="/investments/explore" element={<Explore />} />
            <Route path="/investments/mudarabah" element={<Investments />} />
            <Route path="/investments/ijarah" element={<Investments />} />
            <Route path="/investments/:investmentId" element={<InvestmentDetail />} />
            <Route path="/profit-history" element={<ProfitHistory />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/wallet/deposit" element={<Deposit />} />
            <Route path="/deposit" element={<Navigate to="/wallet/deposit" replace />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="*" element={<Navigate to="/portfolio" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
