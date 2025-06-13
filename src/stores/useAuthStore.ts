import { create } from 'zustand';
import axios from 'axios';

interface AuthStore {
  account: string | null;
  role: string | null;
  token: string;
  hasCheckedAuth: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  setAuth: (
    account: string | null,
    rule: string | null,
    token: string,
    hasCheckedAuth: boolean,
  ) => void;
  setLogout: () => void;
  setLoading: (isLoading: boolean) => void;
  setCheckingAuth: (isCheckingAuth: boolean) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  account: null,
  role: null,
  token: '',
  hasCheckedAuth: false,
  isLoading: false,
  isCheckingAuth: true,
  // 設定登入狀態
  setAuth: (account, role, token, hasCheckedAuth) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    if (account) {
      localStorage.setItem('account', account);
    }
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
    localStorage.removeItem('account');
    set((state) => ({
      ...state,
      account: null,
      role: null,
      token: '',
      hasCheckedAuth: true,
    }));
  },
  // 設定載入狀態
  setLoading: (isLoading) => {
    set((state) => ({
      ...state,
      isLoading,
    }));
  },
  // 是否正在判斷 token 狀態
  setCheckingAuth: (isCheckingAuth) => {
    set((state) => ({
      ...state,
      isCheckingAuth,
    }));
  },
}));
export default useAuthStore;
