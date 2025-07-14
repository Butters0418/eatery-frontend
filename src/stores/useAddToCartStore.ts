import { create } from 'zustand';
import { ProductWithCompositeId, ProductWithQty } from '../types/productType';

interface AddToCartStore {
  cart: ProductWithQty[];
  currentProductId: string | null;
  getTotalPrice: () => number;
  addToCart: (product: ProductWithCompositeId, num: number) => void;
  removeFromCart: (productId: string) => void;
}

const useAddToCartStore = create<AddToCartStore>((set, get) => ({
  cart: [],
  currentProductId: null,
  tableId: null,
  tableToken: null,
  // 計算總金額的方法
  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      // 基本價格
      let itemTotal = item.price * item.qty;

      // 加料選項價格
      if (item.addons) {
        item.addons.forEach((group) => {
          group.options.forEach((option) => {
            if (option.selected) {
              itemTotal += option.price * item.qty;
            }
          });
        });
      }

      return total + itemTotal;
    }, 0);
  },
  // 新增商品到購物車
  addToCart: (product: ProductWithCompositeId, num = 1) => {
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.compositeId === product.compositeId,
      );
      if (existingProduct) {
        // 若商品存在於購物車，則更新數量
        return {
          cart: state.cart.map((item) =>
            item.compositeId === product.compositeId
              ? { ...item, qty: (item.qty || 1) + num }
              : item,
          ),
        };
      } else {
        // 不在購物車中，則新增到購物車
        return { cart: [...state.cart, { ...product, qty: num }] };
      }
    });
  },

  // 從購物車中移除商品
  removeFromCart: (compositeId: string) => {
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.compositeId === compositeId,
      );
      if (existingProduct) {
        if (existingProduct.qty > 1) {
          // 若數量大於1，則減少數量
          return {
            cart: state.cart.map((item) =>
              item.compositeId === compositeId
                ? { ...item, qty: item.qty - 1 }
                : item,
            ),
          };
        } else {
          // 若數量等於1，則從購物車移除
          return {
            cart: state.cart.filter((item) => item.compositeId !== compositeId),
          };
        }
      }
      // 如果商品不存在於購物車，則回傳當前狀態
      return { cart: state.cart };
    });
  },
}));

export default useAddToCartStore;
