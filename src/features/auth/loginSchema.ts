import * as yup from 'yup';

export const loginSchema = yup.object({
  account: yup.string().required('請輸入帳號'),
  password: yup.string().required('請輸入密碼').min(6, '密碼至少 6 個字'),
});
