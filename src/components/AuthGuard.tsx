import { useEffect, ReactNode } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { useCheckMeQuery } from '../hooks/useUserOperations';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isFetching } = useCheckMeQuery();
  const { token, role } = useAuthStore();
  const navigate = useNavigate();

  // useCheckMeQuery 有觸發，若 token 無效或角色不符合，重定向到登入頁面
  useEffect(() => {
    if (!token || (role !== 'staff' && role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [token, role, navigate]);

  // 如果沒有 token，不觸發 useCheckMeQuery，直接重導向到登入頁
  if (!token) return <Navigate to="/login" replace />;

  if (isFetching) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }
  return <>{children}</>;
}

export default AuthGuard;
