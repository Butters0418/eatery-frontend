// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// APIs
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  toggleProductPopular,
} from '../apis/productApi';

// Stores
import useProductStore from '../stores/useProductStore';
import useAuthStore from '../stores/useAuthStore';

// Types
import { Product } from '../types/productType';

// 商品查詢 Hook
export const useProductQuery = () => {
  // ===== Store Hooks =====
  const setProducts = useProductStore((state) => state.setProducts);
  const { token, role } = useAuthStore();

  // ===== API 查詢 =====
  const query = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => {
      const shouldUseToken = role === 'staff' || role === 'admin';
      return fetchProducts(shouldUseToken ? token || undefined : undefined);
    },
  });

  // ===== 解構查詢結果 =====
  const { data, isSuccess, error } = query;

  // ===== Effects =====
  useEffect(() => {
    if (isSuccess && data) {
      setProducts(data);
    }
  }, [isSuccess, data, setProducts]);

  // error
  useEffect(() => {
    if (error) {
      console.error('商品資料獲取失敗:', error.message);
    }
  }, [error]);

  return query;
};

// 新增商品 hook
export const useCreateProduct = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: Omit<Product, '_id' | 'productId'>) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const postRes = createProduct(token, productData);
      return postRes;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            console.error(err.response.data.message);
            break;
          case 403:
            console.error(err.response.data.message);
            break;
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('發生錯誤，請稍後再試');
            break;
        }
      } else {
        console.error('發生錯誤，請稍後再試');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 編輯商品 hook
export const useUpdateProduct = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      productData,
    }: {
      productId: string;
      productData: Omit<Product, '_id' | 'productId'>;
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const updateRes = updateProduct(token, productId, productData);
      return updateRes;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            console.error(err.response.data.message);
            break;
          case 403:
            console.error(err.response.data.message);
            break;
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('發生錯誤，請稍後再試');
            break;
        }
      } else {
        console.error('發生錯誤，請稍後再試');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 刪除商品 hook
export const useDeleteProduct = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const deleteRes = deleteProduct(productId, token);
      return deleteRes;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            console.error(err.response.data.message);
            break;
          case 403:
            console.error(err.response.data.message);
            break;
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('發生錯誤，請稍後再試');
            break;
        }
      } else {
        console.error('發生錯誤，請稍後再試');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 切換商品上架狀態 hook
export const useToggleProductAvailability = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      isAvailable,
    }: {
      productId: string;
      isAvailable: boolean;
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const updateRes = toggleProductAvailability(
        token,
        productId,
        isAvailable,
      );
      return updateRes;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            console.error(err.response.data.message);
            break;
          case 403:
            console.error(err.response.data.message);
            break;
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('發生錯誤，請稍後再試');
            break;
        }
      } else {
        console.error('發生錯誤，請稍後再試');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// 切換商品熱門狀態 hook
export const useToggleProductPopular = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      isPopular,
    }: {
      productId: string;
      isPopular: boolean;
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const updateRes = toggleProductPopular(token, productId, isPopular);
      return updateRes;
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            console.error(err.response.data.message);
            break;
          case 403:
            console.error(err.response.data.message);
            break;
          case 404:
            console.error(err.response.data.message);
            break;
          default:
            console.error('發生錯誤，請稍後再試');
            break;
        }
      } else {
        console.error('發生錯誤，請稍後再試');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
