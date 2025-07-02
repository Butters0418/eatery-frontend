import { create } from 'zustand';
import { Product, ProductWithQuantity } from '../types/productType';

interface AddToCartStore {
  cart: ProductWithQuantity[];
  currentProductId: string | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

const useAddToCartStore = create<AddToCartStore>((set) => ({
  cart: [],
  currentProductId: null,
  addToCart: (product: Product) => {
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        // 若商品存在於購物車，則更新數量
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item,
          ),
        };
      } else {
        // 不在購物車中，則新增到購物車
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }
    });
  },

  removeFromCart: (id: string) => {
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === id);
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          // 若數量大於1，則減少數量
          return {
            cart: state.cart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            ),
          };
        } else {
          // 若數量等於1，則從購物車移除
          return {
            cart: state.cart.filter((item) => item.id !== id),
          };
        }
      }
      // 如果商品不存在於購物車，則回傳當前狀態
      return { cart: state.cart };
    });
  },
}));

export default useAddToCartStore;
