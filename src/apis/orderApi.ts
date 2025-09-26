import axios from 'axios';
import { API } from '../constants/api';
import { OrderPayload } from '../types/productType';
import { formatReceiptData } from '../utils/formatReceiptData';
import { OrderItem } from '../types/productType';
const apiUrl = API.orders;

// 新增訂單 (顧客)
export const postOrder = async (payload: OrderPayload) => {
  const res = await axios.post(apiUrl, payload);
  return res.data;
};

// 取得訂單明細 (顧客)
export const getOrderReceipt = async (tableToken: string) => {
  const res = await axios.get(`${apiUrl}?tableToken=${tableToken}`);
  const receiptData = formatReceiptData(res.data[0]);
  return receiptData;
};

// 取得當日所有訂單
export const getOrders = async (token: string, date?: string) => {
  let url = apiUrl;

  // 如果有日期參數，添加到 query string
  if (date) {
    url += `?date=${date}`;
  }
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 刪除整筆訂單
export const deleteOrder = async (token: string, orderId: string) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/delete`,
    {}, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// 刪除子訂單
export const deleteOrderItem = async (
  token: string,
  orderId: string,
  itemCode: string,
) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/item/${itemCode}/delete`,
    {}, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// 更新送餐狀態
export const updateItemServeStatus = async (
  token: string,
  orderId: string,
  itemCode: string,
  isServed: boolean,
) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/item/${itemCode}/served`,
    { isServed }, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// 更新結帳狀態
export const updateOrderPaymentStatus = async (
  token: string,
  orderId: string,
  isPaid: boolean,
) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/paid`,
    { isPaid }, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// 完成訂單
export const completeOrder = async (token: string, orderId: string) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/complete`,
    {}, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// 編輯子訂單內容
export const updateOrderItem = async (
  token: string,
  orderId: string,
  itemCode: string,
  updatedItem: OrderItem[],
) => {
  const res = await axios.patch(
    `${apiUrl}/${orderId}/item/${itemCode}`,
    {
      item: updatedItem,
    }, // request body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
