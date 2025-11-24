import axios from 'axios';
import { API } from '../constants/api';
import { LoginInfo } from '../types/userType';

const login = API.login;
const checkMe = API.checkMe;
const users = API.users;

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

// ===== (限 admin ) =====
// 取得所有用戶資料 get /api/users
export const fetchAllUsers = async (token: string) => {
  const response = await axios.get(users, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 新增員工帳戶 post /api/users
export const createUser = async (
  token: string,
  staffInfo: { account: string; password: string },
) => {
  const response = await axios.post(users, staffInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 刪除員工帳戶 delete /api/users/:userId
export const deleteUser = async (token: string, userId: string) => {
  const response = await axios.delete(`${users}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 更改員工資料 (可只修改帳號或密碼) patch /api/users/:userId
export const updateUser = async (
  token: string,
  userId: string,
  updateInfo: { account?: string; password?: string },
) => {
  const response = await axios.patch(`${users}/${userId}`, updateInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 解鎖員工帳號 patch /api/users/:userId/unlock
export const unlockUserAccount = async (token: string, userId: string) => {
  const response = await axios.patch(
    `${users}/${userId}/unlock`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

// admin 在登入狀態修改自己密碼 put /api/change-password
export const changePassword = async (
  token: string,
  passwords: { currentPassword: string; newPassword: string },
) => {
  const response = await axios.put(API.changePassword, passwords, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
