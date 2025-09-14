import { AddonGroup } from '../types/productType.ts';

// 配料組字串, 用指定符號連接
export const addonsToString = (addons: AddonGroup[], sign: string) => {
  return addons
    .map((group) => group.options.find((opt) => opt.selected)?.name)
    .filter(Boolean)
    .join(sign);
};
