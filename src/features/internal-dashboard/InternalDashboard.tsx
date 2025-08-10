import { useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useCheckMeQuery } from '../../hooks/useUserOperations';
// 員工點餐頁 (staff 及 admin 可造訪)
function InternalDashboard() {
  const { isFetching } = useCheckMeQuery();
  const { account, token, role, setLogout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (role !== 'staff' && role !== 'admin')) {
      setLogout();
      navigate('/login', { replace: true });
    }
  }, [token, role, setLogout, navigate]);
  return (
    <>
      {isFetching ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <div>
          <header className="flex items-center gap-4 bg-orange-400 p-2">
            <h1 className="mr-auto text-xl">xxx點餐頁</h1>
            <p> {account} 您好</p>
            <button onClick={setLogout}>登出</button>
          </header>
        </div>
      )}
    </>
  );
}
export default InternalDashboard;
