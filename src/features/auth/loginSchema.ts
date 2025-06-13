import * as yup from 'yup';

export const loginSchema = yup.object({
  account: yup.string().required('請輸入帳號').min(6, '帳號至少 6 個字'),
  password: yup.string().required('請輸入密碼').min(6, '密碼至少 6 個字'),
});

export const forgotPasswordSchema = yup.object({
  account: yup.string().required('請輸入帳號').min(6, '帳號至少 6 個字'),
});

export const verifyCodeSchema = yup.object({
  otp: yup
    .string()
    .required('請輸入驗證碼')
    .matches(/^\d{6}$/, '驗證碼為 6 位數字'),
});
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('請輸入密碼')
    .min(6, '密碼至少 6 碼')
    .matches(/^\S*$/, '密碼不能包含空白字元'),

  confirmPassword: yup
    .string()
    .required('請再次輸入密碼')
    .oneOf([yup.ref('password')], '兩次密碼輸入不一致'),
});
