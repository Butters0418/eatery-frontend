// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from '../features/customer/CustomerPage';
import LoginPage from '../features/auth/LoginPage';
import ForgotPassword from '../features/auth/ForgotPassword';
import VerifyCode from '../features/auth/VerifyCode';
import ResetPassword from '../features/auth/ResetPassword';
import InternalDashboard from '../features/internal-dashboard/InternalDashboard';
import AdminPage from '../features/admin/AdminPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/internal-dashboard" element={<InternalDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
