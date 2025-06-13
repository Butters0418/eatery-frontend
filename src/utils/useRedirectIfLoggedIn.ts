import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import axios from 'axios';

const useRedirectIfLoggedIn = () => {
  const { hasCheckedAuth, token, role, setCheckingAuth, setAuth, setLogout } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');

    const navigateByRole = (role: string) => {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'staff') {
        navigate('/internal-dashboard', { replace: true });
      }
    };

    // 尚未驗證，且 localStorage 有 token 才去驗證
    if (!hasCheckedAuth && tokenInStorage) {
      const checkAuth = async () => {
        setCheckingAuth(true);
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/me`,
            {
              headers: {
                Authorization: `Bearer ${tokenInStorage}`,
              },
            },
          );
          const { account, role } = res.data;
          setAuth(account, role, tokenInStorage, true);
          navigateByRole(role);
        } catch (err) {
          console.log(err);
          setLogout();
        } finally {
          setCheckingAuth(false);
        }
      };
      checkAuth();
    } else {
      // 如果沒有 token，則直接設定已檢查過
      if (!tokenInStorage) {
        setCheckingAuth(false);
        setAuth(null, null, '', false);
      }
    }

    // 驗證完成後判斷跳轉
    if (hasCheckedAuth && token && role) {
      navigateByRole(role);
    }
  }, [hasCheckedAuth, token, role, navigate]);
};

export default useRedirectIfLoggedIn;
