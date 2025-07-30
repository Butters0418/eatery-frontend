import { create } from 'zustand';
import { Product } from '../types/productType';

interface ProductStore {
  products: Product[] | null;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: null,
  setProducts: (products: Product[]) => set({ products }),
}));
