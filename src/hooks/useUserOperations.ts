// React 相關
import { useEffect } from 'react';

import useAuthStore from '../stores/useAuthStore';

// 第三方庫
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// APIs
import {
  loginUser,
  getUserProfile,
  resendVerificationCode,
  verifyCode,
  resetPassword,
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
            setErrorMessage(err.response.data.message);
            break;
          case 403:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('登入失敗，請稍後再試');
            break;
        }
      } else {
        setErrorMessage('登入失敗，請稍後再試');
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
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('發生錯誤，請稍後再試');
            break;
        }
      } else {
        setErrorMessage('發生錯誤，請稍後再試');
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
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('發生錯誤，請稍後再試');
            break;
        }
      } else {
        setErrorMessage('發生錯誤，請稍後再試');
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
            setErrorMessage(err.response.data.message);
            break;
          case 403:
            setErrorMessage(err.response.data.message);
            break;
          case 404:
            setErrorMessage(err.response.data.message);
            break;
          default:
            setErrorMessage('發生錯誤，請稍後再試');
            break;
        }
      } else {
        setErrorMessage('發生錯誤，請稍後再試');
      }
    },
  });
};
