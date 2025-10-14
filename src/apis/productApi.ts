import { Product } from '../types/productType';
import axios from 'axios';
import { API } from '../constants/api';

const apiUrl = API.products;

// 取得所有商品資料 api
export const fetchProducts = async (token?: string): Promise<Product[]> => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
  const response = await axios.get(apiUrl, config);
  return response.data.map(({ _id: productId, ...rest }: Product) => ({
    productId,
    ...rest,
  }));
};
