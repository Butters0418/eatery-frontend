import { create } from 'zustand';
import axios from 'axios';

interface AuthStore {
  account: string | null;
  role: string | null;
  token: string;
  hasCheckedAuth: boolean;
  setAuth: (
    account: string | null,
    rule: string | null,
    token: string,
    hasCheckedAuth: boolean,
  ) => void;
  setLogout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  account: null,
  role: null,
  token: '',
  hasCheckedAuth: false,
  // 設定登入狀態
  setAuth: (account, role, token, hasCheckedAuth) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    set((state) => ({
      ...state,
      account,
      role,
      token,
      hasCheckedAuth,
    }));
  },
  // 設定登出狀態
  setLogout: () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    set((state) => ({
      ...state,
      account: null,
      role: null,
      token: '',
      hasCheckedAuth: true,
    }));
  },
}));
export default useAuthStore;
