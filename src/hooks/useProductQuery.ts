// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useQuery } from '@tanstack/react-query';

// APIs
import { fetchProducts } from '../apis/productApi';

// Stores
import { useProductStore } from '../stores/useProductStore';
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
