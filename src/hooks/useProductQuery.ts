import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types/productType';
import { fetchProducts } from '../apis/productApi';
import { useProductStore } from '../stores/useProductStore';

export const useProductQuery = () => {
  const setProducts = useProductStore((state) => state.setProducts);

  const query = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data, isSuccess, error } = query;

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
