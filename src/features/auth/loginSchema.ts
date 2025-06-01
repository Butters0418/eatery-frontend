import * as yup from 'yup';

export const loginSchema = yup.object({
  account: yup.string().required('請輸入帳號').min(3, '帳號至少 3 個字'),
  password: yup.string().required('請輸入密碼').min(6, '密碼至少 6 個字'),
});

export const forgotPasswordSchema = yup.object({
  account: yup.string().required('請輸入帳號').min(3, '帳號至少 3 個字'),
});
