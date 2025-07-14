import { useMemo, useState } from 'react';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { RiFileList3Line } from 'react-icons/ri';

import { SMainSwiper } from './style.ts';
import { formatNumber } from '../../utils/formatNumber.ts';
import { menuData } from '../../constants/menuData.ts';
import { Product } from '../../types/productType.ts';
import Button from '@mui/material/Button';
import useAddToCartStore from '../../stores/useAddToCartStore.ts';
import CartButtonGroup from './components/CartButtonGroup.tsx';
import CheckCartsDialog from './components/CheckCartsDialog.tsx';
import CheckOrdersDialog from './components/CheckOrdersDialog.tsx';
import AddProductDialog from './components/AddProductDialog.tsx';

// 顧客點餐頁
function CustomerPage() {
  const { cart } = useAddToCartStore();
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false); // 控制購物車彈窗開關
  const [orderOpen, setOrderOpen] = useState(false); // 控制訂單明細彈窗開關
  const [productOpen, setProductOpen] = useState(false); // 控制商品詳細彈窗開關
  const [modelProduct, setModelProduct] = useState<Product | null>(null); // 當前選擇的商品

  // 購物物總數量
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0) || 0;

  // menuData 以 category 分組
  const groupedData = useMemo(() => {
    return menuData.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, Product[]>,
    );
  }, []);

  return (
    <div className="overflow-hidden bg-grey-light pb-28 md:pb-48">
      <header className="border-b border-gray-200 bg-white p-4 text-center">
        <h1 className="text-2xl font-bold text-primary">Eatery</h1>
      </header>
      <nav className="border-b border-gray-200 bg-white p-2">123</nav>
      <main className="container mx-auto p-3 xl:max-w-[1280px]">
        {/* 熱門商品 */}
        <div className="py-2">
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
              {menuData
                .filter((item) => item.isPopular)
                .map((popularItem) => {
                  return (
                    <SwiperSlide
                      className="w-56 pb-6 md:w-[270px] md:pb-8"
                      key={popularItem.productId}
                    >
                      <div
                        className="block cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg duration-300"
                        onClick={() => {
                          setModelProduct(popularItem);
                          setProductOpen(true);
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
        {Object.entries(groupedData).map(([category, items]) => {
          return (
            <div className="mt-3 py-2 md:mt-4" key={category}>
              <h2 className="text-2xl font-bold">{category}</h2>
              <ul className="mt-2 grid grid-cols-1 gap-1.5 md:mt-4 md:grid-cols-2 md:gap-4">
                {items.map((item) => {
                  return (
                    <li
                      key={item.productId}
                      className="relative flex cursor-pointer justify-between rounded-lg border border-gray-200 bg-white"
                      onClick={() => {
                        setModelProduct(item);
                        setProductOpen(true);
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
        })}
      </main>
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
        onClick={() => setCartOpen(true)}
      >
        查看購物車{totalQuantity > 0 && `(${totalQuantity})`}
      </Button>

      {/* 購物車彈窗 */}
      <CheckCartsDialog cartOpen={cartOpen} setCartOpen={setCartOpen} />

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
        onClick={() => setOrderOpen(true)}
      >
        <RiFileList3Line />
      </Button>

      {/* 訂單明細彈窗 */}
      <CheckOrdersDialog orderOpen={orderOpen} setOrderOpen={setOrderOpen} />

      {/* 商品詳細資訊 */}
      <Button
        variant="contained"
        color="info"
        className="left-1/2 top-5 z-50 -translate-x-1/2 !shadow-xl"
        sx={{
          position: 'fixed',
          fontSize: { xs: '1rem', md: '1.25rem' },
          borderRadius: 2,
        }}
        onClick={() => setProductOpen(true)}
      >
        打開商品詳細資訊
      </Button>

      {modelProduct && (
        <AddProductDialog
          product={modelProduct}
          productOpen={productOpen}
          setProductOpen={setProductOpen}
        />
      )}
    </div>
  );
}
export default CustomerPage;
