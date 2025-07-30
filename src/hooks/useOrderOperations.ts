import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { postOrder, getOrderReceipt } from '../apis/orderApi';
import useCartStore from '../stores/useCartStore';
import { useReceiptStore } from '../stores/useReceiptStore';

// 提交訂單的 hook
export const useSubmitOrder = () => {
  const { buildOrderPayload } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      const payload = buildOrderPayload();
      const postRes = await postOrder(payload);
      return postRes;
    },
  });
};

// 取得訂單明細的 hook
export const useOrderReceiptQuery = () => {
  const { tableToken } = useCartStore((state) => state.tableInfo);
  const { setReceipt } = useReceiptStore();

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

  const { data, isSuccess, error } = query;

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
