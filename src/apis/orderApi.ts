import axios from 'axios';
import { API } from '../constants/api';
import { OrderPayload } from '../types/productType';
import { formatReceiptData } from '../utils/formatReceiptData';
const apiUrl = API.orders;

// post order api
export const postOrder = async (payload: OrderPayload) => {
  const res = await axios.post(apiUrl, payload);
  return res.data;
};

// get order receipt api
export const getOrderReceipt = async (tableToken: string) => {
  const res = await axios.get(`${apiUrl}?tableToken=${tableToken}`);
  const receiptData = formatReceiptData(res.data[0]);
  return receiptData;
};

// get all orders  api
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

// delete order api
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

// delete single item from order api
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
