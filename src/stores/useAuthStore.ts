// 第三方庫
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ===== 類型定義 =====
interface AuthStore {
  account: string | null;
  role: string | null;
  token: string | null;
  isFromLoginPage: boolean;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  setIsFromLoginPage: (isFromLoginPage: boolean) => void;
  setAuth: (
    account: string | null,
    rule: string | null,
    token: null | string,
  ) => void;
  setLogout: () => void;
}

// 認證狀態管理 Store
const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ===== State =====
      account: null,
      role: null,
      token: null,
      isFromLoginPage: false,
      errorMessage: '',

      // 設定登入狀態
      setAuth: (account, role, token) => {
        console.log('store 寫入成功');
        set({ account, role, token });
      },

      // 設定登出狀態
      setLogout: () => {
        set({ account: null, role: null, token: null });
      },

      // 設定錯誤訊息
      setErrorMessage: (msg) => {
        set({ errorMessage: msg });
      },

      // 設定是否來自登入頁面
      setIsFromLoginPage: (isFromLoginPage) => {
        set({ isFromLoginPage });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        account: state.account,
        role: state.role,
      }),
    },
  ),
);

export default useAuthStore;
