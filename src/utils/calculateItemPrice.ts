import {
  Product,
  AddonGroup,
  AddonOption,
  ProductWithQty,
  OrderItem,
} from '../types/productType';

interface FormValue {
  qty: number;
  [key: string]: string | number;
}

// 用戶表單中的商品價格計算
export const calculatePriceFromForm = (
  item: Product,
  formValues: FormValue,
) => {
  if (!item || !formValues) {
    return 0;
  }
  // 基本價格 × 數量
  let total = item.price * formValues.qty;

  // 加上選擇的配料價格
  item.addons?.forEach((group: AddonGroup) => {
    const selectedOption = group.options.find(
      (opt: AddonOption) => opt.name === formValues[group.group],
    );
    if (selectedOption) {
      total += selectedOption.price * formValues.qty;
    }
  });
  return total;
};

// 用於計算購物車的價格
export const calculatePriceFromCart = (
  item: ProductWithQty | OrderItem,
  useQty: boolean,
) => {
  const qty = useQty ? item.qty : 1;
  let total = item.price;

  item.addons?.forEach((group) => {
    group.options.forEach((opt) => {
      if (opt.selected) {
        total += opt.price;
      }
    });
  });

  return total * qty;
};
