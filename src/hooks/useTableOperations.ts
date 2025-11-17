// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useQuery } from '@tanstack/react-query';

// APIs
import { fetchTables, fetchTableToken } from '../apis/tableApi';

// Stores
import useTableStore from '../stores/useTableStore';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';

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

// 取得桌號的  Token 與 id
export const useTableTokenQuery = (tableNumber: string) => {
  // ===== Store Hooks =====
  const setTable = useCartStore((state) => state.setTable);

  // ===== API 查詢 =====
  const query = useQuery({
    queryKey: ['tableToken', tableNumber],
    queryFn: async () => {
      const tableTokenData = await fetchTableToken(tableNumber);
      return tableTokenData;
    },
    enabled: !!tableNumber, // 只有在 tableNumber 有值時才啟用查詢
  });

  // ===== 解構查詢結果 =====
  const { data, isSuccess, error } = query;

  // ===== Effects =====
  useEffect(() => {
    if (isSuccess && data) {
      console.log('取得桌位資訊成功:', data);
      setTable({
        tableId: data.tableId as string,
        tableToken: data.tableToken as string,
      });
    }
  }, [isSuccess, data, setTable]);

  useEffect(() => {
    if (error) {
      console.error('取得桌位資訊失敗:', error.message);
    }
  }, [error]);

  return query;
};
