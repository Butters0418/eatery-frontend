import { Table } from '../types/tableType';
import axios from 'axios';
import { API } from '../constants/api';

const apiUrl = API.tables;
const tableTokenUrl = API.tableToken;

// 取得所有桌號狀態
export const fetchTables = async (token: string): Promise<Table[]> => {
  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 取得桌號的 QR Token
export const fetchTableToken = async (tableNumber: string) => {
  const normalized = tableNumber.padStart(2, '0');
  const res = await axios.get(`${tableTokenUrl}?code=T-${normalized}`);
  return res.data;
};
