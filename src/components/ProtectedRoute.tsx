import { useEffect, ReactNode } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { useCheckMeQuery } from '../hooks/useUserOperations';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean; // 是否需要 admin 權限
  redirectTo?: string; // 自定義重導向路徑
}

function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isFetching } = useCheckMeQuery();
  const { token, role } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // 沒有 token，導向登入頁
      navigate('/login', { replace: true });
    } else if (requireAdmin && role && role !== 'admin') {
      // 需要 admin 權限但角色不符，導向指定頁面
      navigate(redirectTo === '/login' ? '/order-page' : redirectTo, {
        replace: true,
      });
    } else if (!requireAdmin && role && role !== 'staff' && role !== 'admin') {
      // 一般權限檢查，需要是 staff 或 admin
      navigate('/login', { replace: true });
    }
  }, [token, role, navigate, requireAdmin, redirectTo]);

  // 沒有 token，直接重導向到登入頁
  if (!token) return <Navigate to="/login" replace />;

  // 需要 admin 權限但角色不符
  if (requireAdmin && role && role !== 'admin') {
    return (
      <Navigate
        to={redirectTo === '/login' ? '/order-page' : redirectTo}
        replace
      />
    );
  }

  // 一般權限檢查
  if (!requireAdmin && role && role !== 'staff' && role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // 載入中顯示進度條
  if (isFetching) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
