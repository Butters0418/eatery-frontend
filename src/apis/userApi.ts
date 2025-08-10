import axios from 'axios';
import { API } from '../constants/api';
import { LoginInfo } from '../types/userType';

const login = API.login;
const checkMe = API.checkMe;

// 登入
export const loginUser = async (userInfo: LoginInfo) => {
  const response = await axios.post(login, userInfo);
  return response.data;
};

// 取得當前 token 用戶資料
export const getUserProfile = async (token: string) => {
  const response = await axios.get(checkMe, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 忘記密碼-寄送驗證碼
export const resendVerificationCode = async (account: string) => {
  const response = await axios.post(API.resendVerifyCode, { account });
  return response.data;
};

// 認證驗証碼
export const verifyCode = async (code: string, account: string) => {
  const response = await axios.post(API.verifyResetCode, { code, account });
  return response.data;
};

// 重設密碼
export const resetPassword = async (account: string, newPassword: string) => {
  const response = await axios.post(API.resetPassword, {
    account,
    newPassword,
  });
  return response.data;
};
