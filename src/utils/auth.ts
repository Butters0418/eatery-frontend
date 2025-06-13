import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface AuthUtils {
  setAuth: (
    account: string | null,
    role: string | null,
    token: string,
    hasCheckedAuth: boolean,
  ) => void;
  setLogout: () => void;
}

export const checkAuthStatus = async (
  hasCheckedAuth: boolean,
  token: string | null,
  role: string | null,
  navigate: NavigateFunction,
  { setAuth, setLogout }: AuthUtils,
) => {
  const tokenInStorage = localStorage.getItem('token');

  // 有 token 但未驗證
  if (!hasCheckedAuth && tokenInStorage) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${tokenInStorage}`,
        },
      });
      const { account, role } = res.data;
      setAuth(account, role, tokenInStorage, true);

      navigateByRole(role, navigate);
    } catch (err) {
      console.error(err);
      setLogout();
    }
  }

  // 有 token 寫入 store 且已驗證
  if (hasCheckedAuth && token && role) {
    navigateByRole(role, navigate);
  }
};

const navigateByRole = (role: string, navigate: NavigateFunction) => {
  if (role === 'admin') {
    navigate('/admin', { replace: true });
  } else if (role === 'staff') {
    navigate('/internal-dashboard', { replace: true });
  }
};
