// React 相關
import { useState, useEffect, useMemo, useCallback } from 'react';

// 第三方庫
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

// Components
import ResultDialog from '../../../components/ResultDialog';
import ConfirmDialog from '../../../components/ConfirmDialog';

// Hooks
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../../hooks/useProductOperations';

// Stores
import useProductStore from '../../../stores/useProductStore';
import useAuthStore from '../../../stores/useAuthStore';

// APIs
import { uploadImage } from '../../../apis/uploadApi';

// Utils
import { menuSchema } from './menuSchema';

// Types
import { Product, AddonGroup } from '../../../types/productType';
import { ResultDialogProps } from '../../../components/ResultDialog';

// Icons
import { HiOutlinePlusSm, HiOutlineX } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdImage } from 'react-icons/md';

// ===== 類型定義 =====
interface EditProductDialogProps {
  isOpen: boolean;
  type: 'new' | 'edit';
  targetProduct: Product | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  addons: AddonGroup[];
}

type ResultInfo = Omit<ResultDialogProps, 'onClose'>;

function EditProductDialog({
  isOpen,
  type,
  targetProduct,
  onClose,
}: EditProductDialogProps) {
  // ===== 渲染 UI =====
  return (
    <>
      <Dialog
        open={isOpen}
        autoFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: 680,
            borderRadius: 1,
            p: 0,
          },
        }}
        onClose={onClose}
      >
        <div className="flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'new' ? '新增商品' : '編輯商品'}
            </h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-8 overflow-y-auto p-6">
            {/* 商品資訊 Section */}
            <section>
              <h2 className="pb-4 text-lg font-bold text-gray-900">商品資訊</h2>
              <div className="space-y-6">
                {/* 商品名稱 */}
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-gray-900">
                    商品名稱<span className="text-error">*</span>
                  </p>
                  <TextField
                    placeholder="例如：麻醬麵"
                    fullWidth
                    size="small"
                  />
                </label>

                {/* 商品描述 */}
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-gray-900">
                    商品描述
                  </p>
                  <TextField
                    placeholder="輸入商品描述"
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                  />
                </label>

                {/* 價格和分類 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 價格 */}
                  <label className="flex flex-col">
                    <p className="pb-2 text-base font-medium text-gray-900">
                      價格<span className="text-error">*</span>
                    </p>
                    <TextField
                      type="number"
                      placeholder="0.00"
                      fullWidth
                      size="small"
                    />
                  </label>

                  {/* 分類 */}
                  <label className="flex flex-col">
                    <p className="pb-2 text-base font-medium text-gray-900">
                      分類<span className="text-error">*</span>
                    </p>
                    <FormControl fullWidth size="small">
                      <Select displayEmpty defaultValue="">
                        <MenuItem value="" disabled>
                          選擇一個分類
                        </MenuItem>
                        <MenuItem value="主餐">主餐</MenuItem>
                        <MenuItem value="飲料">飲料</MenuItem>
                        <MenuItem value="甜點">甜點</MenuItem>
                        <MenuItem value="__NEW_CATEGORY__">
                          <span className="font-bold text-primary">
                            新增分類...
                          </span>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </label>
                </div>

                {/* 商品圖片 */}
                <div className="space-y-4">
                  <p className="text-base font-medium text-gray-900">
                    商品圖片
                  </p>
                  <div className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-primary/5">
                    <div className="text-center">
                      <MdImage className="mx-auto text-4xl text-grey" />
                      <p className="mt-2 text-sm text-grey">拖曳或點擊上傳</p>
                    </div>
                  </div>

                  {/* 圖片網址（唯讀） */}
                  <TextField
                    placeholder="https://example.com/image.jpg"
                    fullWidth
                    size="small"
                    disabled
                  />
                </div>
              </div>

              {/* 開關區域 */}
              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 md:grid-cols-2">
                {/* 是否上架 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      是否上架<span className="text-error">*</span>
                    </p>
                    <p className="text-sm text-grey">商品將對顧客可見。</p>
                  </div>
                  <Switch defaultChecked color="primary" />
                </div>

                {/* 是否為熱門商品 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">是否為熱門商品</p>
                    <p className="text-sm text-grey">
                      將此商品標記為熱門項目。
                    </p>
                  </div>
                  <Switch color="primary" />
                </div>
              </div>
            </section>

            {/* 加購選項 Section */}
            <section>
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-bold text-gray-900">加購選項</h2>
                <Button
                  variant="text"
                  startIcon={
                    <HiOutlinePlusSm className="text-base text-secondary" />
                  }
                  sx={{
                    color: 'secondary.main',
                    bgcolor: 'secondary.light',
                    '&:hover': {
                      bgcolor: 'secondary.light',
                      opacity: 0.8,
                    },
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  新增群組
                </Button>
              </div>

              <div className="space-y-4">
                {/* 示例群組 */}
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                  {/* 群組名稱 */}
                  <div className="mb-4 flex items-start gap-4">
                    <label className="flex-1">
                      <p className="pb-2 text-base font-medium text-gray-900">
                        群組名稱
                      </p>
                      <TextField
                        placeholder="例如：選擇您的醬料"
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                    </label>
                    <IconButton>
                      <FaRegTrashCan className="text-base text-error-light" />
                    </IconButton>
                  </div>

                  {/* 選項列表 */}
                  <div className="space-y-3 pl-2">
                    <p className="text-sm font-medium text-grey">選項</p>
                    <div className="flex items-center gap-3">
                      <TextField
                        placeholder="選項名稱"
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                      <TextField
                        type="number"
                        placeholder="0.00"
                        size="small"
                        label="加價$"
                        sx={{
                          width: 200,
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                      <IconButton size="small">
                        <HiOutlineX className="text-base text-error-light" />
                      </IconButton>
                    </div>
                    <div className="flex items-center gap-3">
                      <TextField
                        placeholder="選項名稱"
                        size="small"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                      <TextField
                        type="number"
                        placeholder="0.00"
                        size="small"
                        label="加價$"
                        sx={{
                          width: 200,
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                          },
                        }}
                      />
                      <IconButton size="small">
                        <HiOutlineX className="text-base text-error-light" />
                      </IconButton>
                    </div>

                    <Button
                      variant="text"
                      size="small"
                      startIcon={<HiOutlinePlusSm />}
                      sx={{
                        color: 'secondary.main',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      新增選項
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-4 border-t p-6">
            <Button
              variant="text"
              onClick={onClose}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'grey.600',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: 'primary.main',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {type === 'new' ? '儲存商品' : '更新商品'}
            </Button>
          </footer>
        </div>
      </Dialog>
    </>
  );
}

export default EditProductDialog;
