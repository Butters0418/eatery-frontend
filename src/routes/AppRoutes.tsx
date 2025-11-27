// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerPage from '../features/customer/CustomerPage';
import LoginPage from '../features/auth/LoginPage';
import ForgotPassword from '../features/auth/ForgotPassword';
import VerifyCode from '../features/auth/VerifyCode';
import ResetPassword from '../features/auth/ResetPassword';

import NotFound from '../features/notfound/NotFound';
// Dashboard components
import ProtectedRoute from '../components/ProtectedRoute';
import StaffOrderLayout from '../features/staffOrderPage_temp/StaffOrderLayout';
import OrderManagement from '../features/staffOrderPage_temp/orders/OrderManagement';
import OrderCreationManagement from '../features/staffOrderPage_temp/orderCreation/OrderCreationManagement';
import TableStatusManagement from '../features/staffOrderPage_temp/tablesStatus/TableStatusManagement';
// Admin components
import MenuManagement from '../features/staffOrderPage_temp/admin/MenuManagement';
import TableSettingsManagement from '../features/staffOrderPage_temp/admin/TableSettingsManagement';
import AccountManagement from '../features/staffOrderPage_temp/admin/AccountManagement';

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
            <ProtectedRoute>
              <StaffOrderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OrderManagement />} />
          <Route path="order-creation" element={<OrderCreationManagement />} />
          <Route path="tables-status" element={<TableStatusManagement />} />

          {/* 限 Admin  */}
          <Route path="admin">
            <Route
              path="menu"
              element={
                <ProtectedRoute requireAdmin>
                  <MenuManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="table-settings"
              element={
                <ProtectedRoute requireAdmin>
                  <TableSettingsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="accounts"
              element={
                <ProtectedRoute requireAdmin>
                  <AccountManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        {/* 404 錯誤頁面 - 必須放在最後 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
