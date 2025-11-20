const BASE_API_URL = import.meta.env.VITE_API_URL;

export const API = {
  // authentication APIs
  login: `${BASE_API_URL}/api/login`, // 登入 API
  checkMe: `${BASE_API_URL}/api/me`, // 判斷身份 API
  users: `${BASE_API_URL}/api/users`, // 使用者 API
  verifyResetCode: `${BASE_API_URL}/api/verify-reset-code`, // admin 輸入驗証碼 API
  resendVerifyCode: `${BASE_API_URL}/api/resend-verification-code`, // 重寄驗証碼 API
  resetPassword: `${BASE_API_URL}/api/reset-password`, // 重設密碼 API
  changePassword: `${BASE_API_URL}/api/change-password`, // 更改密碼 API
  tables: `${BASE_API_URL}/api/tables`, // 桌號 API
  tableToken: `${BASE_API_URL}/api/table/qr-token`, // 取得桌號 token 與 ID
  products: `${BASE_API_URL}/api/products`, // 商品 API
  orders: `${BASE_API_URL}/api/orders`, // 訂單 API
  uploadImage: `${BASE_API_URL}/api/upload/image`, // 上傳圖片 API
};
