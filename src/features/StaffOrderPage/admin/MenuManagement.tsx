// React 相關
import { useState, useMemo } from 'react';

// 第三方庫
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skeleton from 'react-loading-skeleton';
import { useMediaQuery } from '@mui/material';
import 'react-loading-skeleton/dist/skeleton.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Hooks
import { useProductQuery } from '../../../hooks/useProductOperations';

// Stores
import useProductStore from '../../../stores/useProductStore';

// Components
import EditProductDialog from './EditProductDialog';
import MenuCard from '../components/MenuCard';
import ResultDialog from '../../../components/ResultDialog';

// Types
import { Product } from '../../../types/productType';
import { ResultDialogProps } from '../../../components/ResultDialog';

// Icons
import { HiOutlinePlusSm } from 'react-icons/hi';

type ResultDialogInfo = Omit<ResultDialogProps, 'onClose'>;

function MenuManagement() {
  // ===== Store Hooks =====
  const products = useProductStore((state) => state.products);

  // ===== API 相關 Hooks =====
  const { isPending: isFetchProductPending } = useProductQuery();

  // ===== 狀態管理 =====
  const [categoryFilter, setCategoryFilter] = useState('所有商品');
  // 結果燈箱
  const [resultInfo, setResultInfo] = useState<ResultDialogInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
    btnText: '',
  });
  const [modelProductInfo, setModelProductInfo] = useState<{
    type: 'new' | 'edit';
    targetProduct: Product | null;
    modelOpen: boolean;
  }>({
    type: 'new',
    targetProduct: null,
    modelOpen: false,
  });

  // ===== 響應式 =====
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  // ===== 事件處理函數 =====
  // 開啟新增商品對話框
  const handleOpenNewProductDialog = () => {
    setModelProductInfo({
      type: 'new',
      targetProduct: null,
      modelOpen: true,
    });
  };

  // 開啟編輯商品對話框
  const handleOpenEditProductDialog = (product: Product) => {
    setModelProductInfo({
      type: 'edit',
      targetProduct: product,
      modelOpen: true,
    });
  };

  // 關閉對話框
  const handleCloseProductInfoDialog = () => {
    setModelProductInfo((prev) => ({ ...prev, modelOpen: false }));
  };

  // 關閉 ResultDialog
  const handleResultDialogClose = () => {
    setResultInfo((prev) => ({ ...prev, isOpen: false }));
  };

  // 切換分類
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // ===== 數據處理 =====
  // 所有分類
  const categories = useMemo(() => {
    if (!products) return ['所有商品']; // 預設至少包含「所有商品」
    return [
      '所有商品',
      '熱門商品',
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  // 篩選後的商品
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (categoryFilter === '所有商品') {
      return products;
    }
    if (categoryFilter === '熱門商品') {
      return products.filter((product: Product) => product.isPopular);
    }
    return products.filter(
      (product: Product) => product.category === categoryFilter,
    );
  }, [products, categoryFilter]);
  // ===== 渲染 UI =====
  return (
    <>
      <div className="space-y-4 2xl:space-y-6">
        <div className="flex flex-col space-y-2 2xl:space-y-2">
          <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
            菜單管理
          </h1>
          <Alert severity="warning">
            <AlertTitle>注意事項</AlertTitle>
            請避免於營業時間刪除商品，以免影響訂單操作。
          </Alert>
        </div>

        {/* 操作列 */}
        <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-custom 2xl:p-4">
          <div className="flex items-center gap-5">
            {/* 分類下拉選單 */}
            <FormControl
              sx={{ m: 0, minWidth: 160 }}
              size={isLargeScreen ? 'medium' : 'small'}
            >
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                displayEmpty
              >
                {categories.map((category: string) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 新增商品按鈕 */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<HiOutlinePlusSm />}
              onClick={handleOpenNewProductDialog}
              sx={{ borderRadius: 2 }}
              size={isLargeScreen ? 'large' : 'medium'}
            >
              新增商品
            </Button>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="rounded-xl bg-white shadow-custom">
          <div className="p-4">
            <h3 className="pb-3 text-xl font-bold text-gray-900">菜單列表</h3>

            {isFetchProductPending ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
                  >
                    <Skeleton width={80} height={80} className="rounded-lg" />
                    <Skeleton width={150} height={24} />
                    <Skeleton width={80} height={24} />
                    <div className="ml-auto flex gap-2">
                      <Skeleton width={60} height={36} />
                      <Skeleton width={60} height={36} />
                      <Skeleton width={40} height={36} />
                      <Skeleton width={40} height={36} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-400">目前沒有商品</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product: Product) => (
                  <MenuCard
                    key={product.productId}
                    product={product}
                    onEdit={handleOpenEditProductDialog}
                    setResultInfo={setResultInfo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 編輯商品對話框 */}
      <EditProductDialog
        isOpen={modelProductInfo.modelOpen}
        type={modelProductInfo.type}
        targetProduct={modelProductInfo.targetProduct}
        onClose={handleCloseProductInfoDialog}
      />

      <ResultDialog
        isOpen={resultInfo.isOpen}
        resultType={resultInfo.resultType}
        title={resultInfo.title}
        message={resultInfo.message}
        btnText={resultInfo.btnText}
        onClose={handleResultDialogClose}
      />
    </>
  );
}
export default MenuManagement;
