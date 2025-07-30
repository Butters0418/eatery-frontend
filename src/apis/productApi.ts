import { Product } from '../types/productType';
import axios from 'axios';
import { API } from '../constants/api';

const apiUrl = API.products;

// get products api
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(apiUrl);
  return response.data.map(({ _id: productId, ...rest }: Product) => ({
    productId,
    ...rest,
  }));
};
