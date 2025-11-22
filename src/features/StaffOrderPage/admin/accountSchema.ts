import * as yup from 'yup';
import type { AnyObjectSchema } from 'yup';

// ===== 管理員密碼修改驗證 =====
export const adminPasswordSchema: AnyObjectSchema = yup.object({
  currentPassword: yup
    .string()
    .trim()
    .required('請輸入舊密碼')
    .min(6, '密碼至少 6 碼')
    .matches(/^[^\s]+$/, '密碼不能包含空白字元'),
  newPassword: yup
    .string()
    .trim()
    .required('請輸入新密碼')
    .min(6, '密碼至少 6 碼')
    .matches(/^[^\s]+$/, '密碼不能包含空白字元'),
  confirmPassword: yup
    .string()
    .trim()
    .required('請再次輸入新密碼')
    .oneOf([yup.ref('newPassword')], '兩次密碼輸入不一致'),
}) as AnyObjectSchema;

// ===== 新增員工帳號驗證 =====
export const createStaffSchema: AnyObjectSchema = yup.object({
  account: yup.string().trim().required('請輸入帳號').min(6, '帳號至少 6 個字'),
  password: yup
    .string()
    .trim()
    .required('請輸入密碼')
    .min(6, '密碼至少 6 碼')
    .matches(/^[^\s]+$/, '密碼不能包含空白字元'),
}) as AnyObjectSchema;

// ===== 更新員工帳號驗證 =====
export const updateStaffSchema: AnyObjectSchema = yup.object({
  account: yup.string().trim().required('請輸入帳號').min(6, '帳號至少 6 個字'),
  password: yup
    .string()
    .trim()
    .optional()
    .test('password-length', '密碼至少 6 碼', (value) => {
      if (!value) return true;
      return value.length >= 6;
    })
    .test('password-space', '密碼不能包含空白字元', (value) => {
      if (!value) return true;
      return /^[^\s]+$/.test(value);
    }),
}) as AnyObjectSchema;
