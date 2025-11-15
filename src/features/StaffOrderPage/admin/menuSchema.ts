import * as yup from 'yup';

// 加料選項驗證
const addonOptionSchema = yup.object({
  name: yup.string().required('選項名稱為必填'),
  price: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue == null) {
        return undefined; // 空值觸發 required 驗證
      }
      return value;
    })
    .required('加價金額為必填')
    .typeError('請輸入有效的數字'),
});

// 加料群組驗證
const addonGroupSchema = yup.object({
  group: yup.string().required('群組名稱為必填'),
  options: yup
    .array()
    .of(addonOptionSchema)
    .min(2, '至少需要兩個選項')
    .required('選項為必填'),
});

// 菜單商品驗證
export const menuSchema = yup.object({
  name: yup.string().required('商品名稱為必填').min(1, '商品名稱不可為空'),
  description: yup
    .string()
    .transform((value) => value || '')
    .default(''),
  price: yup
    .number()
    .min(1, '價格必須大於 0')
    .required('價格為必填')
    .typeError('價格必須為數字'),
  category: yup.string().when('$isNewCategory', {
    is: true,
    then: (schema) => schema.required('請輸入新分類'),
    otherwise: (schema) =>
      schema
        .required('請選擇分類')
        .notOneOf(['__NEW_CATEGORY__'], '請選擇或輸入分類'),
  }),
  imageUrl: yup
    .string()
    .transform((value) => value || '') // 空值轉為空字串
    .test('is-url-or-empty', '請輸入有效的網址格式', (value) => {
      if (!value || value === '') return true;
      return yup.string().url().isValidSync(value);
    })
    .default(''),
  isAvailable: yup.boolean().required('是否上架為必填').default(true),
  isPopular: yup.boolean().default(false),
  addons: yup.array().of(addonGroupSchema).nullable().default(null),
});

export type MenuFormValues = yup.Asserts<typeof menuSchema>;
