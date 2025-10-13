// React 相關
import { useEffect, useMemo, useState } from 'react';

// 第三方庫
import queryString from 'query-string';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from '@mui/material/Button';

// Hooks
import { useProductQuery } from '../../hooks/useProductQuery.ts';
import { useOrderReceiptQuery } from '../../hooks/useOrderOperations.ts';

// Stores
import useCartStore from '../../stores/useCartStore.ts';
import { useProductStore } from '../../stores/useProductStore.ts';
import { useReceiptStore } from '../../stores/useReceiptStore.ts';

// Utils
import { formatNumber } from '../../utils/formatNumber.ts';

// Components
import CartButtonGroup from './components/CartButtonGroup.tsx';
import CheckCartsDialog from './components/CheckCartsDialog.tsx';
import CheckOrdersDialog from './components/CheckReceiptDialog.tsx';
import AddProductDialog from './components/AddProductDialog.tsx';
import SubmitResultDialog from './components/SubmitResultDialog.tsx';
import TopNav from './components/TopNav.tsx';
import Error from '../../components/Error.tsx';

// Styles & Types
import { SMainSwiper } from './style.ts';
import { Product } from '../../types/productType.ts';

// Icons
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { RiFileList3Line } from 'react-icons/ri';

// 定義商品 model 資料的 interface
interface ModelProductInfo {
  targetProduct: Product | null;
  modelOpen: boolean;
}

// 顧客點餐頁
function CustomerPage() {
  // ===== Store Hooks =====
  const products = useProductStore((state) => state.products);
  const { cart, setTable, isCartOpen, setIsCartOpen } = useCartStore();
  const { isReceiptOpen, setIsReceiptOpen } = useReceiptStore();

  // ===== API 相關 Hooks =====
  const { isPending, status, error } = useProductQuery();
  useOrderReceiptQuery();

  // ===== 商品選擇狀態 =====
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [modelProductInfo, setModelProductInfo] = useState<ModelProductInfo>({
    targetProduct: null,
    modelOpen: false,
  });

  // ===== 訂單操作相關狀態 =====
  const [isSubmitResultOpen, setIsSubmitResultOpen] = useState(false);
  const [submitResult, seSubmitResult] = useState<{
    success: boolean;
    title: string;
    message: string;
  } | null>(null);

  // ===== 購物車計算 =====
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0) || 0;

  // ===== 數據處理 =====
  // 將商品以分類分組
  const groupedData = useMemo(() => {
    if (!products) return {};
    return products.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, Product[]>,
    );
  }, [products]);

  // ===== Effects =====
  // 解析 URL query string 取得桌號
  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.tableId && query.tableToken) {
      setTable({
        tableId: query.tableId as string,
        tableToken: query.tableToken as string,
      });
    }
  }, []);

  // 點擊非商品數量控制區域時重置當前選中商品
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tag="product-button-group"]')) {
        setCurrentProductId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ===== 錯誤處理 =====
  if (status === 'error' && error) {
    return <Error />;
  }

  // ===== 渲染 UI =====
  return (
    <>
      <header className="border-b border-gray-200 bg-white p-4 text-center">
        <h1 className="text-2xl font-bold text-primary">Eatery</h1>
      </header>

      <TopNav />

      <div className="relative z-10 overflow-hidden bg-grey-light pb-28 md:pb-48">
        <main className="container mx-auto p-3 xl:max-w-[1280px]">
          {/* 熱門商品 */}
          <div className="py-2" data-category="熱門商品">
            <h2 className="text-2xl font-bold">熱門商品</h2>
            <SMainSwiper className="relative mt-3 md:mt-4">
              <Swiper
                className="main-swiper"
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView="auto"
                breakpoints={{
                  1024: {
                    spaceBetween: 28,
                  },
                }}
                navigation={{
                  nextEl: '.main-swiper-next',
                  prevEl: '.main-swiper-prev',
                }}
                pagination={{
                  el: '.main-swiper-pagination',
                  clickable: true,
                }}
              >
                {isPending
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <SwiperSlide
                        className="w-56 pb-6 md:w-[270px] md:pb-8"
                        key={`skeleton-${idx}`}
                      >
                        <div className="block overflow-hidden rounded-xl bg-white shadow-lg duration-300">
                          <div className="relative">
                            <Skeleton height={192} className="block w-full" />
                            <p className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
                              <Skeleton circle width={36} height={36} />
                            </p>
                          </div>
                          <div className="p-2 px-3">
                            <h3 className="text-base font-semibold md:text-lg">
                              <Skeleton width={80} />
                            </h3>
                            <p className="text-sm text-gray-600 md:text-base">
                              <Skeleton width={40} />
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : products?.length !== 0 &&
                    products
                      ?.filter((item) => item.isPopular)
                      .map((popularItem) => {
                        return (
                          <SwiperSlide
                            className="w-56 pb-6 md:w-[270px] md:pb-8"
                            key={popularItem.productId}
                          >
                            <div
                              className="block cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg duration-300"
                              onClick={() => {
                                setModelProductInfo({
                                  targetProduct: popularItem,
                                  modelOpen: true,
                                });
                              }}
                            >
                              <div className="relative">
                                <img
                                  src={popularItem.imageUrl}
                                  alt={popularItem.name}
                                  className="h-44 w-full object-cover md:h-48"
                                />

                                {/* 購物車按鈕組 */}
                                {popularItem.addons ? (
                                  <p className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
                                    <HiOutlinePlusSm className="text-gray-500" />
                                  </p>
                                ) : (
                                  <CartButtonGroup
                                    group={'papular'}
                                    item={popularItem}
                                    currentProductId={currentProductId}
                                    setCurrentProductId={setCurrentProductId}
                                  />
                                )}
                              </div>

                              <div className="p-2 px-3">
                                <h3 className="text-base font-semibold md:text-lg">
                                  {popularItem.name}
                                </h3>
                                <p className="text-sm text-gray-600 md:text-base">
                                  <span className="text-[0.8em]">$</span>
                                  {formatNumber(popularItem.price)}
                                </p>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
              </Swiper>
              <div className="main-swiper-pagination z-50"></div>
              <div className="main-swiper-prev absolute left-0 top-1/2 z-50 flex h-10 w-10 -translate-x-1/2 -translate-y-3/4 items-center justify-center rounded-full bg-white shadow-lg">
                <FaAngleLeft className="[.swiper-button-disabled_&]:text-gray-300" />
              </div>
              <div className="main-swiper-next absolute right-0 top-1/2 z-50 flex h-10 w-10 -translate-y-3/4 translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
                <FaAngleRight className="[.swiper-button-disabled_&]:text-gray-400" />
              </div>
            </SMainSwiper>
          </div>

          {/* 其他商品 */}

          {isPending ? (
            <>
              <div className="mt-3 py-2 md:mt-4">
                <h2 className="text-2xl font-bold">
                  <Skeleton width={120} />
                </h2>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 md:mt-4 md:grid-cols-2 md:gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
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
                        width={120}
                        height={120}
                        className="rounded-lg"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 py-2 md:mt-4">
                <h2 className="text-2xl font-bold">
                  <Skeleton width={120} />
                </h2>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 md:mt-4 md:grid-cols-2 md:gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
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
              </div>
            </>
          ) : (
            Object.entries(groupedData).map(([category, items]) => {
              return (
                <div
                  className="mt-3 py-2 md:mt-4"
                  key={category}
                  data-category={category}
                >
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 md:mt-4 md:grid-cols-2 md:gap-4">
                    {items.map((item) => {
                      return (
                        <li
                          key={item.productId}
                          className="relative flex cursor-pointer justify-between rounded-lg border border-gray-200 bg-white"
                          onClick={() => {
                            setModelProductInfo({
                              targetProduct: item,
                              modelOpen: true,
                            });
                          }}
                        >
                          <div className="flex flex-col p-2.5 md:p-4">
                            <h3 className="text-base font-medium md:text-lg">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 md:text-base">
                              <span className="text-[0.8em]">$</span>
                              {formatNumber(item.price)}
                            </p>
                            {item.isPopular && (
                              <p className="mt-auto">
                                <span className="inline-block rounded-full bg-primary-light bg-opacity-20 px-3 py-0.5 text-sm font-semibold text-primary md:text-base">
                                  熱門商品
                                </span>
                              </p>
                            )}
                          </div>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-28 w-32 rounded-lg object-cover md:h-36 md:w-44"
                          />

                          {item.addons ? (
                            <p className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg">
                              <HiOutlinePlusSm className="text-gray-500" />
                            </p>
                          ) : (
                            <CartButtonGroup
                              group={'normal'}
                              item={item}
                              currentProductId={currentProductId}
                              setCurrentProductId={setCurrentProductId}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* 查看購物車按鈕 */}
      <Button
        variant="contained"
        color="primary"
        className="bottom-5 left-1/2 z-50 -translate-x-1/2 !shadow-xl md:bottom-10"
        sx={{
          position: 'fixed',
          fontSize: { xs: '1rem', md: '1.25rem' },
          borderRadius: 2,
        }}
        onClick={() => setIsCartOpen(true)}
      >
        查看購物車{totalQuantity > 0 && `(${totalQuantity})`}
      </Button>

      {/* 購物車彈窗 */}
      <CheckCartsDialog
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        setSubmitResult={seSubmitResult}
        setSubmitResultOpen={setIsSubmitResultOpen}
      />

      {/* 查看訂單明細按鈕*/}
      <Button
        variant="contained"
        color="secondary"
        className="bottom-5 right-2 z-50 !shadow-xl md:bottom-10 md:right-5"
        sx={{
          position: 'fixed',
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          borderRadius: 4,
          padding: { xs: 1.5, md: 2 },
          minWidth: 'auto',
        }}
        onClick={() => setIsReceiptOpen(true)}
      >
        <RiFileList3Line />
      </Button>

      {/* 訂單明細彈窗 */}
      <CheckOrdersDialog
        isReceiptOpen={isReceiptOpen}
        setIsReceiptOpen={setIsReceiptOpen}
      />

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

export default CustomerPage;
