// React 相關
import { useState } from 'react';

// 第三方庫
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Switch from '@mui/material/Switch';
import axios from 'axios';

// Hooks
import {
  useToggleProductAvailability,
  useToggleProductPopular,
  useDeleteProduct,
} from '../../../hooks/useProductOperations';

// Components
import ConfirmDialog from '../../../components/ConfirmDialog';

// Utils
import { formatNumber } from '../../../utils/formatNumber';

// Types
import { Product } from '../../../types/productType';
import { ResultDialogProps } from '../../../components/ResultDialog';

// Icons
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';

// ===== 類型定義 =====

type ResultDialogInfo = Omit<ResultDialogProps, 'onClose'>;

interface MenuCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  setResultInfo: (resultInfo: ResultDialogInfo) => void;
}

function MenuCard({ product, onEdit, setResultInfo }: MenuCardProps) {
  // ===== API 相關 Hooks =====
  const { mutate: updateProductAvailabilityMutation } =
    useToggleProductAvailability();
  const { mutate: updateProductPopularityMutation } = useToggleProductPopular();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // ===== 狀態管理 =====
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // ===== 事件處理函數 =====
  // 開啟編輯燈箱
  const handleOpenEditDialog = () => {
    onEdit(product);
  };

  // 開啟刪除確認燈箱
  const handleOpenDeleteDialog = () => {
    setConfirmDialogOpen(true);
  };

  // 刪除商品
  const handleDeleteProduct = () => {
    if (!product.productId) return;

    deleteProduct(product.productId, {
      onSuccess: () => {
        setResultInfo({
          isOpen: true,
          resultType: 'success',
          title: '刪除成功',
          message: '商品已成功刪除。',
          btnText: '關 閉',
        });
      },
      onError: (err) => {
        const errMsg = axios.isAxiosError(err)
          ? err.response?.data.message
          : '發生錯誤，請稍後再試';
        setResultInfo({
          isOpen: true,
          resultType: 'error',
          title: '錯誤',
          message: errMsg,
          btnText: '關 閉',
        });
      },
      onSettled: () => {
        setConfirmDialogOpen(false);
      },
    });
  };

  // 切換上架狀態
  const handleUpdateAvailability = (isAvailable: boolean) => {
    if (!product.productId) return;

    updateProductAvailabilityMutation(
      {
        productId: product.productId,
        isAvailable: isAvailable,
      },
      {
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
      },
    );
  };

  // 切換熱門狀態
  const handleUpdatePopular = (isPopular: boolean) => {
    if (!product.productId) return;

    updateProductPopularityMutation(
      {
        productId: product.productId,
        isPopular: isPopular,
      },
      {
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
      },
    );
  };

  return (
    <>
      <div className="flex items-center gap-5 overflow-hidden rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
        {/* 商品圖片 */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-28 w-28 shrink-0 object-cover"
        />

        {/* 商品資訊 */}
        <div className="flex flex-1 items-center gap-4">
          {/* 價格 */}
          <div className="w-[80px]">
            <p className="text-lg font-semibold text-primary">
              <span className="text-sm">$</span>
              {formatNumber(product.price)}
            </p>
          </div>
          {/* 品名 */}
          <div className="min-w-[120px]">
            <h4 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h4>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="ml-auto flex w-auto shrink-0 items-center gap-4 px-3">
          {/* 上架狀態 */}
          <div className="flex items-center gap-1.5">
            <FormControlLabel
              control={
                <Switch
                  checked={product.isAvailable}
                  onChange={() =>
                    handleUpdateAvailability(!product.isAvailable)
                  }
                  color="primary"
                />
              }
              label={product.isAvailable ? '已上架' : '已下架'}
            />
          </div>

          {/* 熱門狀態 */}
          <div className="mr-5 flex items-center gap-1.5">
            <FormControlLabel
              control={
                <Switch
                  checked={product.isPopular}
                  onChange={() => handleUpdatePopular(!product.isPopular)}
                  color="primary"
                />
              }
              label={product.isPopular ? '熱門' : '一般'}
            />
          </div>

          {/* 編輯/刪除按鈕 */}
          <ButtonGroup variant="outlined" color="info">
            <Button
              sx={{ paddingX: 2, paddingY: 1 }}
              onClick={handleOpenEditDialog}
            >
              <MdEdit className="text-lg" />
            </Button>
            <Button
              sx={{ paddingX: 2, paddingY: 1 }}
              onClick={handleOpenDeleteDialog}
            >
              <FaRegTrashCan className="text-lg" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* 刪除確認對話框 */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        resultType="info"
        title="確認刪除商品"
        message={`確定要刪除「${product.name}」嗎？此操作無法復原。`}
        onConfirm={handleDeleteProduct}
        onClose={() => setConfirmDialogOpen(false)}
        btnText="確認刪除"
        isPending={isDeleting}
      />
    </>
  );
}

export default MenuCard;
