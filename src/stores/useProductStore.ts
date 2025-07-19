import { create } from 'zustand';
import { Product } from '../types/productType';
import axios from 'axios';

interface ProductStore {
  products: Product[] | null;
  isLoading: boolean;
  fetchProducts: () => void;
}
// 取得 .env 檔案中的 API URL
const apiUrl = import.meta.env.VITE_API_URL + '/api/products';

export const useProductStore = create<ProductStore>((set) => ({
  isLoading: false,
  products: null,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(apiUrl);
      const newData = response.data.map(
        ({
          _id,
          name,
          description,
          price,
          category,
          imageUrl,
          isAvailable,
          isPopular,
          addons,
        }: Product) => {
          return {
            productId: _id,
            name,
            description,
            price,
            category,
            imageUrl,
            isAvailable,
            isPopular,
            addons,
          };
        },
      );

      set({
        products: newData,
      });
      setTimeout(() => {
        set({ isLoading: false });
      }, 200);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
}));
