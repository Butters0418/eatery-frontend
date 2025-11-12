// React 相關
import { useState } from 'react';

// 第三方庫
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Switch from '@mui/material/Switch';

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

// Icons
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';

// ===== 類型定義 =====
interface MenuCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

function MenuCard({ product, onEdit }: MenuCardProps) {
  // ===== API 相關 Hooks =====
  const { mutate: toggleAvailability } = useToggleProductAvailability();
  const { mutate: togglePopular } = useToggleProductPopular();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  // ===== 狀態管理 =====
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // ===== 事件處理函數 =====
  // 開啟編輯對話框
  const handleOpenEditDialog = () => {
    onEdit(product);
  };

  // 開啟刪除確認對話框
  const handleOpenDeleteDialog = (event: React.MouseEvent) => {
    event.stopPropagation();
    setConfirmDialogOpen(true);
  };

  // 切換上架狀態
  const handleToggleAvailability = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.stopPropagation();
    if (!product._id) return;

    toggleAvailability({
      productId: product._id,
      isAvailable: event.target.checked,
    });
  };

  // 切換熱門狀態
  const handleTogglePopular = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (!product._id) return;

    togglePopular({
      productId: product._id,
      isPopular: event.target.checked,
    });
  };

  // 刪除商品
  const handleDeleteProduct = () => {
    if (!product._id) return;

    deleteProduct(product._id, {
      onSuccess: () => {
        setConfirmDialogOpen(false);
      },
      onError: (error: Error) => {
        console.error('商品刪除失敗:', error);
      },
    });
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
            <span className="text-sm text-gray-600">
              {product.isAvailable ? '已上架' : '已下架'}
            </span>
            <Switch
              checked={product.isAvailable}
              onChange={handleToggleAvailability}
              color="primary"
              size="small"
            />
          </div>

          {/* 熱門狀態 */}
          <div className="mr-5 flex items-center gap-1.5">
            <span className="text-sm text-gray-600">
              {product.isPopular ? '熱門' : '一般'}
            </span>
            <Switch
              checked={product.isPopular}
              onChange={handleTogglePopular}
              color="primary"
              size="small"
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
