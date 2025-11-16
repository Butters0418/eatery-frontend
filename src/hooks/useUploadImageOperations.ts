// APIs
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../apis/uploadApi';

// 第三方庫
import axios from 'axios';

// Stores
import useAuthStore from '../stores/useAuthStore';

interface UploadImageParams {
  file: File;
  type?: string;
}

export const useUploadImageOperations = () => {
  // ===== Store Hooks =====
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: (params: UploadImageParams) => {
      if (!token) {
        return Promise.reject(new Error('使用者未登入'));
      }
      return uploadImage(token, params);
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
