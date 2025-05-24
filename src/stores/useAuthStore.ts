import { create } from 'zustand';
import axios from 'axios';

interface AuthStore {
  account: string | null;
  role: string | null;
  token: string | null;
  hasCheckedAuth: boolean;
  setAuth: (
    account: string,
    rule: string,
    token: string,
    hasCheckedAuth: boolean,
  ) => void;
  setLogout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  account: null,
  role: null,
  token: null,
  hasCheckedAuth: false,
  // 設定登入狀態
  setAuth: (
    account: string,
    role: string,
    token: string,
    hasCheckedAuth: boolean,
  ) => {
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
      token: null,
      hasCheckedAuth: true,
    }));
  },
}));
export default useAuthStore;
