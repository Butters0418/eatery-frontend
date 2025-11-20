// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// APIs
import { fetchTables, fetchTableToken, createTable, deleteTable } from '../apis/tableApi';

// Stores
import useTableStore from '../stores/useTableStore';
import useAuthStore from '../stores/useAuthStore';
import useCartStore from '../stores/useCartStore';

// 取得所有桌號狀態
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

// 新增桌子
export const useCreateTable = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableNumber: number) => {
      if (!token) {
        throw new Error('使用者未登入');
      }
      const createRes = createTable(token, tableNumber);
      return createRes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTables'] });
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
  });
};

// 刪除桌子
export const useDeleteTable = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: string) => {
      if (!token) {
        throw new Error('使用者未登入');
      }
      return deleteTable(token, tableId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTables'] });
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
  });
};
