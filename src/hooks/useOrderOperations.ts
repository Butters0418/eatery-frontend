// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// APIs
import {
  postOrder,
  getOrderReceipt,
  getOrders,
  deleteOrderItem,
  deleteOrder,
  updateItemServeStatus,
  updateOrderPaymentStatus,
  completeOrder,
  updateOrderItem,
} from '../apis/orderApi';

// Stores
import useCartStore from '../stores/useCartStore';
import useReceiptStore from '../stores/useReceiptStore';
import useOrdersStore from '../stores/useOrdersStore';
import useAuthStore from '../stores/useAuthStore';

// Types
import { OrderItem } from '../types/productType';

// ===== 訂單操作相關 Hooks =====

// 提交訂單的 hook
export const useSubmitOrder = () => {
  // ===== Store Hooks =====
  const { buildOrderPayload } = useCartStore();
  const { token, role } = useAuthStore();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async () => {
      const payload = buildOrderPayload();
      const shouldUseToken = role === 'staff' || role === 'admin';
      // 如果是員工或管理者，帶上 token
      if (shouldUseToken && !token) {
        throw new Error('使用者 token 是必需的');
      }
      if (shouldUseToken && token) {
        const postRes = await postOrder(payload, token);
        return postRes;
      }
      // 如果是顧客，不帶 token
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
export const useAllOrdersQuery = (selectedDate?: string) => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const { setOrders } = useOrdersStore();

  // ===== API 查詢 =====
  const query = useQuery({
    queryKey: ['allOrders', selectedDate],
    queryFn: async () => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }

      const orders = await getOrders(token, selectedDate);
      return orders;
    },
    // 暫時移除 refetchOnWindowFocus: false，讓 React Query 可以自動同步
    // refetchOnWindowFocus: false,
    staleTime: 5 * 1000, // 5 秒內認為資料是新的，減少請求
    // refetchInterval: 60 * 1000, // 每60秒自動重新取得
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

// 刪除單一餐點的 hook
export const useDeleteOrderItem = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: { orderId: string; itemCode: string }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId, itemCode } = params;
      const deleteRes = await deleteOrderItem(token, orderId, itemCode);
      return deleteRes;
    },
    onSuccess: () => {
      // 刪除整張訂單後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('訂單刪除成功，正在重新獲取訂單列表...');
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

// 刪除整張訂單的 hook
export const useDeleteOrder = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: { orderId: string }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId } = params;
      const deleteRes = await deleteOrder(token, orderId);
      return deleteRes;
    },
    onSuccess: () => {
      // 刪除整張訂單後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('訂單刪除成功，正在重新獲取訂單列表...');
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

// 更新餐點送餐狀態的 hook
export const useUpdateItemServeStatus = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      itemCode: string;
      isServed: boolean;
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId, itemCode, isServed } = params;
      const updateRes = await updateItemServeStatus(
        token,
        orderId,
        itemCode,
        isServed,
      );
      return updateRes;
    },
    onSuccess: () => {
      // 更新送餐狀態後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('送餐狀態更新成功，正在重新獲取訂單列表...');
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

// 更新訂單結帳狀態的 hook
export const useUpdateOrderPaymentStatus = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: { orderId: string; isPaid: boolean }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId, isPaid } = params;
      const updateRes = await updateOrderPaymentStatus(token, orderId, isPaid);
      return updateRes;
    },
    onSuccess: () => {
      // 更新結帳狀態後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('結帳狀態更新成功，正在重新獲取訂單列表...');
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

// 更新訂單完成狀態的 hook
export const useUpdateOrderCompletionStatus = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: { orderId: string }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId } = params;
      const updateRes = await completeOrder(token, orderId);
      return updateRes;
    },
    onSuccess: () => {
      // 更新訂單完成狀態後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('訂單完成狀態更新成功，正在重新獲取訂單列表...');
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

// 編輯子訂單項目的 hook
export const useUpdateOrderItem = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // ===== Mutation =====
  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      itemCode: string;
      updatedItems: OrderItem[];
    }) => {
      if (!token) {
        throw new Error('使用者 token 是必需的');
      }
      const { orderId, updatedItems, itemCode } = params;
      const updateRes = await updateOrderItem(
        token,
        orderId,
        itemCode,
        updatedItems,
      );
      return updateRes;
    },
    onSuccess: () => {
      // 更新子訂單內容後，重新獲取訂單列表
      queryClient.invalidateQueries({
        queryKey: ['allOrders'],
      });

      console.log('子訂單內容更新成功，正在重新獲取訂單列表...');
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
