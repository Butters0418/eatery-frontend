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

// 新增商品 api
export const createProduct = async (
  token: string,
  productData: Omit<Product, '_id' | 'productId'>,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(apiUrl, productData, config);
  return response.data;
};

// 編輯商品 api
export const updateProduct = async (
  token: string,
  productId: string,
  productData: Omit<Product, '_id' | 'productId'>,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${apiUrl}/${productId}`,
    productData,
    config,
  );
  return response.data;
};

// 刪除商品 api
export const deleteProduct = async (token: string, productId: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${apiUrl}/${productId}`, config);
  return response.data;
};

// 切換商品上架狀態 api
export const toggleProductAvailability = async (
  token: string,
  productId: string,
  isAvailable: boolean,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${apiUrl}/${productId}/available`,
    { isAvailable },
    config,
  );
  return response.data;
};

// 切換商品熱門狀態 api
export const toggleProductPopular = async (
  token: string,
  productId: string,
  isPopular: boolean,
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(
    `${apiUrl}/${productId}/popular`,
    { isPopular },
    config,
  );
  return response.data;
};
