import { Table } from '../types/tableType';
import axios from 'axios';
import { API } from '../constants/api';

const apiUrl = API.tables;

// 取得所有桌號狀態
export const fetchTables = async (token: string): Promise<Table[]> => {
  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
