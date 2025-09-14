// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useMutation, useQuery } from '@tanstack/react-query';

// APIs
import { postOrder, getOrderReceipt, getOrders } from '../apis/orderApi';

// Stores
import useCartStore from '../stores/useCartStore';
import { useReceiptStore } from '../stores/useReceiptStore';
import { useOrdersStore } from '../stores/useOrdersStore';
import useAuthStore from '../stores/useAuthStore';

// ===== 訂單操作相關 Hooks =====

// 提交訂單的 hook
export const useSubmitOrder = () => {
  // ===== Store Hooks =====
  const { buildOrderPayload } = useCartStore();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async () => {
      const payload = buildOrderPayload();
      const postRes = await postOrder(payload);
      return postRes;
    },
  });
};

// 取得訂單明細的 hook(顧客)
export const useOrderReceiptQuery = () => {
  // ===== Store Hooks =====
  const { tableToken } = useCartStore((state) => state.tableInfo);
  const { setReceipt } = useReceiptStore();

  // ===== API 查詢 =====
  const query = useQuery({
    queryKey: ['orderReceipt', tableToken],
    queryFn: async () => {
      if (!tableToken) {
        throw new Error('桌號 Token 是必需的');
      }
      const receipt = await getOrderReceipt(tableToken);
      return receipt;
    },
    enabled: !!tableToken,
  });

  // ===== 解構查詢結果 =====
  const { data, isSuccess, error } = query;

  // ===== Effects =====
  useEffect(() => {
    if (isSuccess && data) {
      console.log('訂單明細獲取成功:', data);
      setReceipt(data);
    }
  }, [isSuccess, data, setReceipt]);

  useEffect(() => {
    if (error) {
      console.error('訂單明細獲取失敗:', error.message);
    }
  }, [error]);

  return query;
};

// 取得所有訂單的 hook
export const useAllOrdersQuery = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const { setOrders } = useOrdersStore();

  // ===== API 查詢 =====
  const query = useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }

      const orders = await getOrders(token);
      return orders;
    },
    refetchOnWindowFocus: false, // 禁止切回頁籤時 refetch
  });

  // ===== 解構查詢結果 =====
  const { data, isSuccess, error } = query;

  // ===== Effects =====
  useEffect(() => {
    if (isSuccess && data) {
      console.log('取得訂單成功:', data);
      setOrders(data);
    }
  }, [isSuccess, data, setOrders]);

  useEffect(() => {
    if (error) {
      console.error('取得訂單失敗:', error.message);
    }
  }, [error]);

  return query;
};
