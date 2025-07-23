import { create } from 'zustand';
import { Product } from '../types/productType';

interface ProductStore {
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
}
// 取得 .env 檔案中的 API URL

export const useProductStore = create<ProductStore>((set) => ({
  products: null,
  setProducts: (products: Product[]) => set({ products }),
}));
