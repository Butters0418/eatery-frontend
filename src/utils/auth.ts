import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';

interface AuthUtils {
  setAuth: (account: string | null, role: string | null, token: string) => void;
  setLogout: () => void;
}

export const checkAuthStatus = async (
  token: string | null,
  role: string | null,
  navigate: NavigateFunction,
  { setAuth, setLogout }: AuthUtils,
) => {
  const tokenInStorage = localStorage.getItem('token');

  // 有 token 但未驗證
  if (tokenInStorage) {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${tokenInStorage}`,
        },
      });
      const { account, role } = res.data;
      setAuth(account, role, tokenInStorage);

      navigateByRole(role, navigate);
    } catch (err) {
      console.error(err);
      setLogout();
    }
  }

  // 有 token 寫入 store 且已驗證
  if (token && role) {
    navigateByRole(role, navigate);
  }
};

const navigateByRole = (role: string, navigate: NavigateFunction) => {
  if (role === 'admin') {
    navigate('/order-page', { replace: true });
  } else if (role === 'staff') {
    navigate('/order-page', { replace: true });
  }
};
