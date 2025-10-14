// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useQuery } from '@tanstack/react-query';

// APIs
import { fetchTables } from '../apis/tableApi';

// Stores
import useTableStore from '../stores/useTableStore';
import useAuthStore from '../stores/useAuthStore';

export const useTableQuery = () => {
  // ===== Store Hooks =====
  const setTables = useTableStore((state) => state.setTables);
  const { token } = useAuthStore();

  // ===== API 查詢 =====
  const query = useQuery({
    queryKey: ['allTables'],
    queryFn: async () => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const tables = await fetchTables(token);
      return tables;
    },
  });

  // ===== 解構查詢結果 =====
  const { data, isSuccess, error } = query;

  // ===== Effects =====
  useEffect(() => {
    if (isSuccess && data) {
      console.log('取得桌位成功:', data);
      setTables(data);
    }
  }, [isSuccess, data, setTables]);

  useEffect(() => {
    if (error) {
      console.error('取得桌位失敗:', error.message);
    }
  }, [error]);

  return query;
};
