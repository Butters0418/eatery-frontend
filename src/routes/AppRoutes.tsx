// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from '../features/customer/CustomerPage';
import LoginPage from '../features/auth/LoginPage';
import ForgotPassword from '../features/auth/ForgotPassword';
import VerifyCode from '../features/auth/VerifyCode';
import ResetPassword from '../features/auth/ResetPassword';

// Dashboard components
import AuthGuard from '../components/AuthGuard';
import StaffOrderLayout from '../features/StaffOrderPage/StaffOrderLayout';
import DineInManagement from '../features/StaffOrderPage/dineIn/DineInManagement';
import OrderManagement from '../features/StaffOrderPage/orders/OrderManagement';
import TakeoutManagement from '../features/StaffOrderPage/takeout/TakeoutManagement';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerPage />}></Route>
        {/* auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* order pages */}
        <Route
          path="/order-page"
          element={
            <AuthGuard>
              <StaffOrderLayout />
            </AuthGuard>
          }
        >
          <Route index element={<OrderManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="dine-in" element={<DineInManagement />} />
          <Route path="takeout" element={<TakeoutManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
