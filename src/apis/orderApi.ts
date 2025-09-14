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
export const getOrders = async (token: string) => {
  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
