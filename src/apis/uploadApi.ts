import axios from 'axios';

import { API } from '../constants/api';

const apiUrl = API.uploadImage;

interface UploadImageParams {
  file: File;
  type?: string;
}

// 上傳圖片到後端 API
export const uploadImage = async (token: string, params: UploadImageParams) => {
  const formData = new FormData();
  formData.append('image', params.file);

  // 如果有 type 參數，則加入 FormData
  if (params.type) {
    formData.append('type', params.type);
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(apiUrl, formData, config);
  return response.data.imageUrl;
};
