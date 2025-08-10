// 管理者後台 (僅 admin 可造訪)
import { useState, useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
// custom hooks
function AdminPage() {
  const { account, token, role, setLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== 'admin') {
      setLogout();
      navigate('/login', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [token, role, setLogout, navigate]);
  return (
    <>
      {isLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : (
        <div>
          <header className="flex items-center gap-4 bg-orange-400 p-2">
            <h1 className="mr-auto text-xl">管理頁</h1>
            <p> {account} 您好</p>
            <button onClick={setLogout}>登出</button>
          </header>
        </div>
      )}
    </>
  );
}
export default AdminPage;
