// 第三方庫
import { create } from 'zustand';

// Types
import { Product } from '../types/productType';

// ===== 類型定義 =====
interface ProductStore {
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
}

// 商品狀態管理 Store
const useProductStore = create<ProductStore>((set) => ({
  // ===== State =====
  products: null,

  // ===== Actions =====
  setProducts: (products: Product[]) => set({ products }),
}));

export default useProductStore;
