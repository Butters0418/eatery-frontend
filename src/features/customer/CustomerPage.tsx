import { useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { FaRegTrashCan, FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { TbBowlChopsticks } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

import { SMainSwiper } from './style.ts';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { RiFileList3Line } from 'react-icons/ri';
import { formatNumber } from '../../utils/formatNumber.ts';

// 本地資料
import { menuData } from '../../constants/menuData.ts';
import { Product } from '../../types/productType.ts';
// 顧客點餐頁
function CustomerPage() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number>(0);

  //  處理加入購物車的邏輯
  const handleAddToCart = () => {
    // 如果未展開且數量為0，則展開且數量加1
    if (!isOpen && cartItems === 0) {
      setIsOpen(true);
      setCartItems(cartItems + 1);
      // 如果未展開且數量大於0，則僅展開
    } else if (!isOpen && cartItems > 0) {
      setIsOpen(true);
    } else {
      if (cartItems < 20) {
        setCartItems(cartItems + 1);
      }
    }
  };

  // 處理減少購物車的邏輯
  const handleRemoveFromCart = () => {
    if (cartItems === 1) {
      setIsOpen(false);
      setCartItems(0);
      return;
    }
    if (cartItems > 0) {
      setCartItems(cartItems - 1);
    }
  };
  // 將 menuData 按照 category 分組
  const groupedData = menuData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div className="bg-grey-light pb-28 md:pb-48">
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
                      key={popularItem.id}
                    >
                      <div
                        className="block overflow-hidden rounded-xl bg-white shadow-lg duration-300"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        <div className="relative">
                          <img
                            src={popularItem.imageUrl}
                            alt={popularItem.name}
                            className="h-44 w-full object-cover md:h-48"
                          />

                          <div
                            className="text-md absolute bottom-2 right-2 h-8 w-24 md:h-9 md:w-[108px] md:text-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <motion.div
                              className="absolute right-0 top-0 h-full w-9 rounded-full bg-white shadow-lg"
                              initial={false}
                              animate={{ width: isOpen ? '100%' : '33.3%' }}
                              transition={{ duration: 0.3 }}
                            ></motion.div>
                            {/* +1 */}
                            <button
                              className="absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
                              onClick={handleAddToCart}
                            >
                              {!isOpen && cartItems > 0 ? (
                                <p className="pb-0.5 font-semibold text-secondary">
                                  {cartItems}
                                </p>
                              ) : (
                                <HiOutlinePlusSm className="text-gray-500" />
                              )}
                            </button>
                            {/* 數字 */}

                            <AnimatePresence>
                              {isOpen && (
                                <motion.p
                                  className="absolute bottom-0.5 right-1/3 z-20 flex h-full w-1/3 items-center justify-center font-semibold text-secondary"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    transition: { duration: 0.3, delay: 0.2 },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    transition: { duration: 0.1, delay: 0 },
                                  }}
                                >
                                  {cartItems}
                                </motion.p>
                              )}
                            </AnimatePresence>

                            {/* -1 或垃圾桶 */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.button
                                  className="absolute right-2/3 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
                                  onClick={handleRemoveFromCart}
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    transition: { duration: 0.3, delay: 0.2 },
                                  }}
                                  exit={{
                                    opacity: 0,
                                    transition: { duration: 0.1, delay: 0 },
                                  }}
                                >
                                  {cartItems > 1 ? (
                                    <HiOutlineMinusSm className="text-gray-500" />
                                  ) : (
                                    <FaRegTrashCan className="text-error-light" />
                                  )}
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
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
                      key={item.id}
                      className="relative flex justify-between rounded-lg border border-gray-200 bg-white"
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
                      <div
                        className="text-md absolute bottom-2 right-2 h-8 w-24 md:h-9 md:w-[108px] md:text-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <motion.div
                          className="absolute right-0 top-0 h-full w-9 rounded-full bg-white shadow-lg"
                          initial={false}
                          animate={{ width: isOpen ? '100%' : '33.3%' }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                        {/* +1 */}
                        <button
                          className="absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
                          onClick={handleAddToCart}
                        >
                          {!isOpen && cartItems > 0 ? (
                            <p className="pb-0.5 font-semibold text-secondary">
                              {cartItems}
                            </p>
                          ) : (
                            <HiOutlinePlusSm className="text-gray-500" />
                          )}
                        </button>
                        {/* 數字 */}

                        <AnimatePresence>
                          {isOpen && (
                            <motion.p
                              className="absolute bottom-0.5 right-1/3 z-20 flex h-full w-1/3 items-center justify-center font-semibold text-secondary"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.3, delay: 0.2 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.1, delay: 0 }, // 移除退場的延遲
                              }}
                            >
                              {cartItems}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* -1 或垃圾桶 */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.button
                              className="absolute right-2/3 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
                              onClick={handleRemoveFromCart}
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.3, delay: 0.2 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.1, delay: 0 }, // 移除退場的延遲
                              }}
                            >
                              {cartItems > 1 ? (
                                <HiOutlineMinusSm className="text-gray-500" />
                              ) : (
                                <FaRegTrashCan className="text-error-light" />
                              )}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </main>
    </div>
  );
}
export default CustomerPage;
