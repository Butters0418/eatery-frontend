// React 相關
import { useEffect } from 'react';

import useAuthStore from '../stores/useAuthStore';

// 第三方庫
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// APIs
import {
  loginUser,
  getUserProfile,
  resendVerificationCode,
  verifyCode,
  resetPassword,
  fetchAllUsers,
  createUser,
  deleteUser,
  updateUser,
  unlockUserAccount,
  changePassword,
} from '../apis/userApi';

// type
import { LoginInfo } from '../types/userType';

// 用戶登入
export const useLoginMutation = () => {
  const { setAuth, setErrorMessage, setIsFromLoginPage } = useAuthStore();
  return useMutation({
    mutationFn: async (userInfo: LoginInfo) => {
      setErrorMessage('');
      const response = await loginUser(userInfo);
      return response;
    },
    onSuccess: (data) => {
      const {
        token,
        user: { account, role },
      } = data;
      setAuth(account, role, token);
      setIsFromLoginPage(true);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 401:
          case 403:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('登入失敗,請稍後再試');
            break;
        }
      } else {
        setErrorMessage('登入失敗,請稍後再試');
      }
    },
  });
};

// 判斷 token 是否有效 (僅由非登入頁面進入使用)
export const useCheckMeQuery = () => {
  const { token, isFromLoginPage, setAuth, setLogout } = useAuthStore();

  const query = useQuery({
    queryKey: ['checkMe', token],
    queryFn: () => getUserProfile(token!),
    enabled: !!token && !isFromLoginPage,
    refetchInterval: 12 * 60 * 60 * 1000, // 12小時自動重新查詢一次
    refetchIntervalInBackground: true, // 視窗不在焦點也觸發
    staleTime: 12 * 60 * 60 * 1000,
    retry: false,
  });

  const { data, isSuccess, error } = query;
  // success
  useEffect(() => {
    if (isSuccess && data) {
      const { account, role } = data;
      setAuth(account, role, token);
    }
  }, [isSuccess, data, token, setAuth]);

  // error
  useEffect(() => {
    if (error) {
      setLogout();
    }
  }, [error, setLogout]);

  return query;
};

// 忘記密碼-寄送驗證碼
export const useResendVerificationCodeMutation = () => {
  const { setErrorMessage, setAuth, setLogout } = useAuthStore();
  return useMutation({
    mutationFn: async (account: string) => {
      setErrorMessage('');
      setAuth(account, null, null);
      const response = await resendVerificationCode(account);
      return response;
    },
    onError: (err) => {
      setLogout();
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('發生錯誤,請稍後再試');
      }
    },
  });
};

// 認證驗証碼
export const useVerifyCodeMutation = () => {
  const { setErrorMessage } = useAuthStore();
  return useMutation({
    mutationFn: async ({
      code,
      account,
    }: {
      code: string;
      account: string;
    }) => {
      setErrorMessage('');
      const response = await verifyCode(code, account);
      return response;
    },
    onSuccess: () => {},
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('發生錯誤,請稍後再試');
      }
    },
  });
};

// 重設密碼
export const useResetPasswordMutation = () => {
  const { setErrorMessage, setLogout } = useAuthStore();
  return useMutation({
    mutationFn: async ({
      account,
      newPassword,
    }: {
      account: string;
      newPassword: string;
    }) => {
      setErrorMessage('');
      const response = await resetPassword(account, newPassword);
      return response;
    },
    onError: (err) => {
      setLogout();
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 403:
          case 404:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('發生錯誤,請稍後再試');
            break;
        }
      } else {
        setErrorMessage('發生錯誤,請稍後再試');
      }
    },
  });
};

// ===== Admin 帳號管理相關 Hooks =====

// 取得所有使用者
export const useUsersQuery = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const users = await fetchAllUsers(token);
      return users;
    },
    enabled: !!token,
  });
};

// 新增店員
export const useCreateStaffMutation = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staffInfo: { account: string; password: string }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const response = await createUser(token, staffInfo);
      return response;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 401:
          case 403:
          case 409:
            console.error(err.response.data.message);
            break;
          default:
            console.error('新增店員失敗,請稍後再試');
            break;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// 更新店員資訊
export const useUpdateStaffMutation = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      updateInfo,
    }: {
      userId: string;
      updateInfo: { account?: string; password?: string };
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const response = await updateUser(token, userId, updateInfo);
      return response;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 401:
          case 403:
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('更新帳號失敗,請稍後再試');
            break;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// 刪除店員
export const useDeleteStaffMutation = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const response = await deleteUser(token, userId);
      return response;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 401:
          case 403:
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('刪除帳號失敗,請稍後再試');
            break;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// 解鎖店員
export const useUnlockStaffMutation = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const response = await unlockUserAccount(token, userId);
      return response;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 401:
          case 403:
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('解鎖帳號失敗,請稍後再試');
            break;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// 修改管理員密碼
export const useChangeAdminPasswordMutation = () => {
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (passwords: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const response = await changePassword(token, passwords);
      return response;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
          case 401:
          case 403:
          case 404:
          case 500:
            console.error(err.response.data.message);
            break;
          default:
            console.error('修改密碼失敗,請稍後再試');
            break;
        }
      }
    },
  });
};
