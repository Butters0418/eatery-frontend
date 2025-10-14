// React 相關
import { useState, useMemo } from 'react';

// 第三方庫
import { useQueryClient } from '@tanstack/react-query';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useMediaQuery } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Hooks
import { useProductQuery } from '../../../hooks/useProductOperations';
import { useSubmitOrder } from '../../../hooks/useOrderOperations';
import { useTableQuery } from '../../../hooks/useTableOperations';

// Stores
import useProductStore from '../../../stores/useProductStore';
import useCartStore from '../../../stores/useCartStore';
import useTableStore from '../../../stores/useTableStore';

// Utils
import { formatNumber } from '../../../utils/formatNumber';
import { addonsToString } from '../../../utils/addonsToString';
import { calculatePriceFromCart } from '../../../utils/calculateItemPrice';

// Components
import AddProductDialog from '../../customer/components/AddProductDialog';
import SubmitResultDialog from '../../customer/components/SubmitResultDialog';

// Types
import { Product } from '../../../types/productType';

// Icons
import { HiOutlinePlusSm, HiOutlineMinusSm } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';

enum OrderType {
  DINE_IN = 'dineIn',
  TAKEOUT = 'takeout',
}

// 定義商品 model 資料的 interface
interface ModelProductInfo {
  targetProduct: Product | null;
  modelOpen: boolean;
}

// 員工點餐管理頁
function OrderCreationManagement() {
  // ===== Store Hooks =====
  const products = useProductStore((state) => state.products);
  const tables = useTableStore((state) => state.tables);
  const {
    cart,
    addToCart,
    removeFromCart,
    getTotalPrice,
    clearCart,
    setTable,
    orderType,
    setOrderType,
  } = useCartStore();

  // ===== API 相關 Hooks =====
  const queryClient = useQueryClient();
  const { isPending: isFetchProductPending } = useProductQuery();
  const { mutate: submitOrder, isPending: isSubmitOrderPending } =
    useSubmitOrder();
  useTableQuery();

  // ===== 狀態管理 =====
  const [tableNumber, setTableNumber] = useState<string>('');
  const [tabView, setTabView] = useState('所有商品');
  const [tableNumberError, setTableNumberError] = useState<boolean>(false);
  const [modelProductInfo, setModelProductInfo] = useState<ModelProductInfo>({
    targetProduct: null,
    modelOpen: false,
  });
  const [isSubmitResultOpen, setIsSubmitResultOpen] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    title: string;
    message: string;
  } | null>(null);

  console.log(tables);
  // ===== 響應式 =====
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  // ===== 事件處理函數 =====
  // 切換桌號
  const handleChangeTableNumber = (event: SelectChangeEvent) => {
    setTableNumber(event.target.value);
    if (tableNumberError) {
      setTableNumberError(false); // 清除錯誤訊息
    }
    // 設定 tableInfo
    const currentTable = tables?.find(
      (table) => table.tableNumber === Number(event.target.value),
    );
    const tableInfo = {
      tableId: currentTable ? currentTable._id : null,
      tableToken: currentTable ? currentTable.tableToken : null,
    };
    setTable(tableInfo);
  };

  // 切換商品類別
  const handleTabChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: string,
  ) => {
    // 防止取消選擇，如果 nextView 是 null 就保持原來的值
    if (nextView !== null) {
      setTabView(nextView);
    }
  };

  // submit 事件
  const submitHandler = () => {
    // 內用時檢查桌號是否必填
    if (orderType === OrderType.DINE_IN && !tableNumber) {
      setTableNumberError(true);
      return;
    }
    // 清除錯誤訊息
    setTableNumberError(false);

    submitOrder(undefined, {
      onSuccess: (res) => {
        const {
          message,
          order: { orderCode },
        } = res;

        setSubmitResult({
          success: true,
          title: message || '訂單提交成功!',
          message: `訂單編號 - ${orderCode}`,
        });

        queryClient.invalidateQueries({
          queryKey: ['allOrders'],
          exact: false,
        });
      },
      onError: (error: Error) => {
        console.error('訂單提交失敗:', error);
        setSubmitResult({
          success: false,
          title: '訂單提交失敗!',
          message: '請確認桌位狀態或重新整理',
        });
      },
      onSettled: () => {
        clearCart();
        setTimeout(() => {
          setIsSubmitResultOpen(true); // 開啟訂單提交結果對話框
        }, 300);
      },
    });
  };

  // ===== 數據處理 =====
  // tab 商品類別
  const categoryData = useMemo(() => {
    if (!products) return [];
    return [
      '所有商品',
      '熱門商品',
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  // 篩選後的商品
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (tabView === '所有商品') {
      return products;
    }
    if (tabView === '熱門商品') {
      return products.filter((product: Product) => product.isPopular);
    }
    return products.filter((product: Product) => product.category === tabView);
  }, [products, tabView]);

  // ===== 渲染 UI =====
  return (
    <>
      <div className="space-y-4 2xl:space-y-6">
        <div className="flex flex-col space-y-2 2xl:space-y-2">
          <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
            開始點餐 {tabView} {orderType} {tableNumber}
          </h1>
        </div>
        <div className="flex items-center justify-start space-x-3 rounded-xl bg-white p-3 shadow-custom 2xl:space-x-4 2xl:p-4">
          {/* 訂單類型 */}
          <div className="flex w-fit rounded-xl bg-gray-100 p-1 2xl:p-1.5">
            {[
              { key: 'dineIn', label: '內用' },
              { key: 'takeout', label: '外帶' },
            ].map((item) => (
              <button
                key={item.key}
                className={`touch-manipulation rounded-lg px-4 py-2 text-sm font-medium 2xl:min-h-[44px] 2xl:px-6 2xl:py-2.5 2xl:text-base ${orderType === item.key && 'bg-white text-secondary shadow-custom'}`}
                type="button"
                onClick={() => setOrderType(item.key as OrderType)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 內用桌號 */}
          {orderType === OrderType.DINE_IN && (
            <div className="mt-0 w-40">
              <FormControl
                fullWidth
                sx={{ m: 0, minWidth: 160, height: isLargeScreen ? 56 : 44 }}
                size={isLargeScreen ? 'medium' : 'small'}
                error={!!tableNumberError}
              >
                <InputLabel id="select-label" color="secondary">
                  {tableNumberError ? '桌號為必填' : '桌號'}
                </InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={tableNumber}
                  label="桌號"
                  color="secondary"
                  onChange={handleChangeTableNumber}
                  MenuProps={{
                    sx: {
                      '& .MuiMenuItem-root': {
                        '&.Mui-selected': {
                          backgroundColor: 'secondary.light',
                        },
                      },
                    },
                  }}
                >
                  {tables &&
                    tables.map((table) => {
                      return (
                        <MenuItem
                          key={table.tableNumber}
                          value={table.tableNumber}
                          disabled={!table.canOrder}
                        >
                          {table.tableNumber} 桌
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          )}
        </div>

        {/* 點餐區 */}
        <div className="grid min-h-[800px] grid-cols-10 divide-x divide-gray-200 overflow-hidden rounded-xl bg-white shadow-custom 2xl:divide-x-2">
          {/* 分類 */}
          <div className="col-span-1">
            <ToggleButtonGroup
              orientation="vertical"
              value={tabView}
              exclusive
              onChange={handleTabChange}
              fullWidth
              color="primary"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 0,
                  borderLeft: 'none',
                  borderRight: 'none',
                  '&:first-of-type': {
                    borderTop: 'none',
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  },
                  '&:last-of-type': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                },
              }}
            >
              {isFetchProductPending ? (
                <Skeleton
                  count={6}
                  className="h-full"
                  containerClassName="h-12 p-1"
                />
              ) : (
                categoryData.map((category: string) => (
                  <ToggleButton
                    key={category}
                    value={category}
                    aria-label={category}
                  >
                    {category}
                  </ToggleButton>
                ))
              )}
            </ToggleButtonGroup>
          </div>

          {/* 菜單 */}
          <div className="col-span-6 p-4">
            <h3 className="pb-3 pl-1.5 text-xl font-bold text-gray-900">
              菜單列表
            </h3>
            {isFetchProductPending ? (
              <ul className="mt-2 grid grid-cols-1 gap-1.5 md:mt-4 md:grid-cols-2 md:gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <li
                    key={`skeleton-item-${idx}`}
                    className="relative flex justify-between rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex w-full flex-col p-2.5 md:p-4">
                      <h3 className="text-base font-medium md:text-lg">
                        <Skeleton width={80} />
                      </h3>
                      <p className="text-sm text-gray-600 md:text-base">
                        <Skeleton width={40} />
                      </p>
                      <div className="mt-auto">
                        <Skeleton width={60} height={24} />
                      </div>
                    </div>
                    <Skeleton
                      height={112}
                      width={128}
                      className="h-28 w-32 rounded-lg md:h-36 md:w-44"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid grid-cols-1 gap-1.5 xl:grid-cols-2 xl:gap-4">
                {filteredProducts.map((item: Product) => (
                  <li
                    key={item.productId}
                    className={`relative flex cursor-pointer justify-between rounded-lg border border-gray-200 bg-white ${!item.isAvailable && 'pointer-events-none opacity-50 brightness-90'}`}
                    onClick={() => {
                      setModelProductInfo({
                        targetProduct: item,
                        modelOpen: true,
                      });
                    }}
                  >
                    <div className="flex flex-col p-2.5 2xl:p-4">
                      <h3 className="text-base font-medium 2xl:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 2xl:text-base">
                        <span className="text-[0.8em]">$</span>
                        {formatNumber(item.price)}
                      </p>
                      {item.isPopular && (
                        <p className="mt-auto">
                          <span className="inline-block rounded-full bg-primary-light bg-opacity-20 px-3 py-0.5 text-sm font-semibold text-primary 2xl:text-base">
                            熱門商品
                          </span>
                        </p>
                      )}
                    </div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-24 w-28 rounded-lg object-cover 2xl:h-32 2xl:w-36"
                    />

                    <p className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
                      <HiOutlinePlusSm className="text-gray-500" />
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 購物車 */}
          <div className="col-span-3 p-4">
            <h3 className="border-b border-gray-200 pb-3 pl-1.5 text-xl font-bold text-gray-900">
              訂單確認
            </h3>
            {cart.length === 0 ? (
              <p className="my-6 text-lg text-gray-400">目前購物車為空!</p>
            ) : (
              <>
                <ul>
                  {cart.length > 0 &&
                    cart.map((item) => {
                      return (
                        <li
                          className="flex items-stretch justify-between border-b border-gray-200 px-1 py-2 text-left"
                          key={item.compositeId}
                        >
                          <div className="ml-2 flex flex-col">
                            <h3 className="text-base font-medium 2xl:text-lg">
                              {item.name}
                            </h3>
                            {item.addons && (
                              <p className="text-xs text-gray-400 2xl:text-sm">
                                {addonsToString(item.addons, ' / ')}
                              </p>
                            )}

                            <p className="mt-auto text-sm font-semibold text-primary 2xl:text-lg">
                              <small>$</small>
                              {calculatePriceFromCart(item, false)}
                            </p>
                          </div>

                          <div className="text-md ml-auto grid h-10 w-24 flex-shrink-0 grid-cols-3 self-center rounded-full bg-white px-1 shadow-md 2xl:w-28 2xl:px-2 2xl:text-lg">
                            <button
                              className="flex items-center justify-center"
                              onClick={() => {
                                if (item.compositeId) {
                                  removeFromCart(item.compositeId);
                                }
                              }}
                            >
                              {item.qty > 1 ? (
                                <HiOutlineMinusSm className="text-gray-500" />
                              ) : (
                                <FaRegTrashCan className="text-error-light" />
                              )}
                            </button>
                            <p className="flex items-center justify-center pb-0.5 font-semibold text-secondary">
                              {item.qty}
                            </p>
                            <button
                              className="flex items-center justify-center"
                              onClick={() => {
                                if (item.qty < 20) {
                                  addToCart(item, 1);
                                }
                              }}
                            >
                              <HiOutlinePlusSm className="text-gray-500" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                </ul>

                <h3 className="mb-6 mt-1.5 pl-2 text-left text-lg font-bold 2xl:mb-10 2xl:mt-4 2xl:text-xl">
                  訂單金額 :{' '}
                  <span className="text-primary">
                    <small>$</small>
                    {formatNumber(getTotalPrice())}
                  </span>
                </h3>
                <div className="flex flex-col gap-2 xl:flex-row xl:gap-6">
                  <Button
                    onClick={clearCart}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                    disabled={isSubmitOrderPending}
                  >
                    <p className="text-lg">清空購物車</p>
                  </Button>
                  <Button
                    onClick={submitHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                    disabled={isSubmitOrderPending}
                  >
                    {isSubmitOrderPending ? (
                      <Box sx={{ display: 'flex' }}>
                        <CircularProgress size="28px" color="inherit" />
                      </Box>
                    ) : (
                      <p className="text-lg">送出訂單</p>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* 商品詳細燈箱 */}
      {modelProductInfo.targetProduct && (
        <AddProductDialog
          modelProductInfo={modelProductInfo}
          setModelProductInfo={setModelProductInfo}
        />
      )}

      <SubmitResultDialog
        isSubmitResultOpen={isSubmitResultOpen}
        submitResult={submitResult}
        setIsSubmitResultOpen={setIsSubmitResultOpen}
      />
    </>
  );
}
export default OrderCreationManagement;
