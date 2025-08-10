const BASE_API_URL = import.meta.env.VITE_API_URL;

export const API = {
  // authentication APIs
  login: `${BASE_API_URL}/api/login`, // 登入 API
  checkMe: `${BASE_API_URL}/api/me`, // 判斷身份 API
  users: `${BASE_API_URL}/api/users`, // 使用者 API
  verifyResetCode: `${BASE_API_URL}/api/verify-reset-code`, // admin 輸入驗証碼 API
  resendVerifyCode: `${BASE_API_URL}/api/resend-verification-code`, // 重寄驗証碼 API
  resetPassword: `${BASE_API_URL}/api/reset-password`, // 重設密碼 API

  products: `${BASE_API_URL}/api/products`, // 商品 API
  orders: `${BASE_API_URL}/api/orders`, // 訂單 API
};
