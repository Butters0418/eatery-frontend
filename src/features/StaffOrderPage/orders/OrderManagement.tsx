import { useState, useMemo, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';
import OrderCard from '../components/OrderCard';
import { BiSolidError } from 'react-icons/bi';
import { MdErrorOutline } from 'react-icons/md';

import { Orders } from '../../../types/orderType';
import { OrderType, OrderStatus } from '../../../types/orderType';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { FaRegCheckCircle } from 'react-icons/fa';

import { useAllOrdersQuery } from '../../../hooks/useOrderOperations';
import { useOrdersStore } from '../../../stores/useOrdersStore';

// 初始化 dayjs 中文語言包
dayjs.locale('zh-tw');

// 訂單分類樣式對應表
const statusStyleMap = [
  {
    bg: '#F7F7F7',
    border: '#6B7280',
    text: '#6B7280',
    label: '全部狀態',
    status: OrderStatus.ALL,
    type: OrderType.ALL,
  },
  {
    bg: '#FFF3E9',
    border: '#EC9E68',
    text: '#EC9E68',
    label: '處理中',
    status: OrderStatus.PENDING,
    type: OrderType.ALL,
  },
  {
    bg: '#EAF8F7',
    border: '#3CAAA5',
    text: '#3CAAA5',
    label: '待結帳',
    status: OrderStatus.SERVED_UNPAID,
    type: OrderType.DINE_IN,
  },
  {
    bg: '#e0f8ff',
    border: '#4285c9',
    text: '#4295c9',
    label: '待確認完成',
    status: OrderStatus.SERVED_PAID,
    type: OrderType.ALL,
  },
  {
    bg: '#EBF6F2',
    border: '#2F847C',
    text: '#2F847C',
    label: '已完成',
    status: OrderStatus.COMPLETED,
    type: OrderType.ALL,
  },
  {
    bg: '#FFF1F0',
    border: '#E06959',
    text: '#E06959',
    label: '已刪除',
    status: OrderStatus.DELETED,
    type: OrderType.ALL,
  },
];

function OrderManagement() {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.ALL);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(
    OrderStatus.ALL,
  );
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(dayjs());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [now, setNow] = useState(dayjs());
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  // 將日期轉換為 API 需要的格式
  const selectedDate = datePickerValue
    ? datePickerValue.format('YYYY-MM-DD')
    : undefined;

  // 取得 訂單 api
  const { ordersData } = useOrdersStore();
  const { isError, isPending } = useAllOrdersQuery(selectedDate);

  // 顯示 Snackbar 並設定訊息
  const handleShowSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // 關閉 Snackbar
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 根據 orderType 和 activeStatus 過濾訂單
  const filteredOrdersData = useMemo(() => {
    if (!ordersData) return [];

    return ordersData
      .filter((order) => {
        // 1. 根據 orderType 篩選
        let orderTypeMatch = true;
        if (orderType !== OrderType.ALL) {
          if (orderType === OrderType.DINE_IN) {
            orderTypeMatch = order.orderType === '內用';
          } else if (orderType === OrderType.TAKEOUT) {
            orderTypeMatch = order.orderType === '外帶';
          }
        }

        // 2. 根據 activeStatus 篩選
        let statusMatch = true;
        if (activeStatus !== OrderStatus.ALL) {
          switch (activeStatus) {
            case OrderStatus.PENDING:
              // 處理中：根據訂單類型有不同邏輯，且不包含已刪除
              if (order.orderType === '內用') {
                // 內用：未送餐且未結帳，且未被刪除
                statusMatch =
                  !order.isAllServed && !order.isPaid && !order.isDeleted;
              } else if (order.orderType === '外帶') {
                // 外帶：未送餐但已結帳（外帶訂單成立時必須先結帳），且未被刪除
                statusMatch =
                  !order.isAllServed && order.isPaid && !order.isDeleted;
              }
              break;
            case OrderStatus.SERVED_UNPAID:
              // 待結帳：已送餐完畢但未結帳（僅限內用），且未被刪除
              statusMatch =
                order.isAllServed &&
                !order.isPaid &&
                order.orderType === '內用' &&
                !order.isDeleted;
              break;
            case OrderStatus.SERVED_PAID:
              // 待確認完成：已結帳已送餐，但訂單狀態不是已完成，且未被刪除
              statusMatch =
                order.isPaid &&
                order.isAllServed &&
                !order.isComplete &&
                !order.isDeleted;
              break;
            case OrderStatus.COMPLETED:
              // 已完成，且未被刪除
              statusMatch = order.isComplete && !order.isDeleted;
              break;
            case OrderStatus.DELETED:
              // 已刪除
              statusMatch = order.isDeleted;
              break;
            default:
              statusMatch = true;
          }
        } else {
          // 當選擇「全部狀態」時，排除已刪除的訂單
          statusMatch = !order.isDeleted;
        }

        return orderTypeMatch && statusMatch;
      })
      .sort((a, b) => {
        // 按創建時間排序，時間越早的排越前面
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
  }, [ordersData, orderType, activeStatus]);

  // 計算各狀態的訂單數量
  const getStatusCounts = useMemo(() => {
    if (!ordersData) return {};

    const counts: Record<string, number> = {};

    // 先根據當前選擇的 orderType 過濾訂單
    const typeFilteredOrders = ordersData.filter((order) => {
      if (orderType === OrderType.ALL) return true;
      if (orderType === OrderType.DINE_IN) return order.orderType === '內用';
      if (orderType === OrderType.TAKEOUT) return order.orderType === '外帶';
      return true;
    });

    // 計算各狀態的數量
    typeFilteredOrders.forEach((order) => {
      // 全部狀態（排除已刪除）
      if (!order.isDeleted) {
        counts[OrderStatus.ALL] = (counts[OrderStatus.ALL] || 0) + 1;
      }

      // 處理中
      if (order.orderType === '內用') {
        // 內用：未送餐且未結帳，且未被刪除
        if (!order.isAllServed && !order.isPaid && !order.isDeleted) {
          counts[OrderStatus.PENDING] = (counts[OrderStatus.PENDING] || 0) + 1;
        }
      } else if (order.orderType === '外帶') {
        // 外帶：未送餐但已結帳，且未被刪除
        if (!order.isAllServed && order.isPaid && !order.isDeleted) {
          counts[OrderStatus.PENDING] = (counts[OrderStatus.PENDING] || 0) + 1;
        }
      }

      // 待結帳（僅限內用）
      if (
        order.isAllServed &&
        !order.isPaid &&
        order.orderType === '內用' &&
        !order.isDeleted
      ) {
        counts[OrderStatus.SERVED_UNPAID] =
          (counts[OrderStatus.SERVED_UNPAID] || 0) + 1;
      }

      // 待確認完成
      if (
        order.isPaid &&
        order.isAllServed &&
        !order.isComplete &&
        !order.isDeleted
      ) {
        counts[OrderStatus.SERVED_PAID] =
          (counts[OrderStatus.SERVED_PAID] || 0) + 1;
      }

      // 已完成
      if (order.isComplete && !order.isDeleted) {
        counts[OrderStatus.COMPLETED] =
          (counts[OrderStatus.COMPLETED] || 0) + 1;
      }

      // 已刪除
      if (order.isDeleted) {
        counts[OrderStatus.DELETED] = (counts[OrderStatus.DELETED] || 0) + 1;
      }
    });

    return counts;
  }, [ordersData, orderType]);

  // 根據 orderType 過濾 statusStyleMap，並加入數量
  const filteredStatusStyles = useMemo(() => {
    const filtered =
      orderType === OrderType.ALL
        ? statusStyleMap
        : statusStyleMap.filter(
            (style) => style.type === orderType || style.type === OrderType.ALL,
          );

    // 為每個狀態添加數量資訊
    return filtered.map((style) => ({
      ...style,
      count: getStatusCounts[style.status] || 0,
    }));
  }, [orderType, getStatusCounts]);

  // 計算等待時間的函數
  const calculateWaiting = (createdAt: string) => {
    const orderTime = dayjs(createdAt);
    const diffInMinutes = now.diff(orderTime, 'minute');

    if (diffInMinutes < 60) {
      return {
        diffInText: diffInMinutes > 0 ? `${diffInMinutes} 分鐘` : '剛剛',
        diffInMinutes: diffInMinutes,
      };
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return {
        diffInText:
          minutes > 0 ? `${hours} 小時 ${minutes} 分鐘` : `${hours} 小時`,
        diffInMinutes: diffInMinutes,
      };
    }
  };

  // 判斷是否為處理中的訂單
  const isPendingOrder = (order: Orders) => {
    if (order.isDeleted || order.isComplete) return false;

    if (order.orderType === '內用') {
      return !order.isAllServed && !order.isPaid;
    } else if (order.orderType === '外帶') {
      return !order.isAllServed && order.isPaid;
    }

    return false;
  };

  // 若 activeStatus 不在 filteredStatusStyles 中，重設為 ALL
  useEffect(() => {
    if (
      activeStatus !== OrderStatus.ALL &&
      !filteredStatusStyles.some((status) => status.status === activeStatus)
    ) {
      setActiveStatus(OrderStatus.ALL);
    }
  }, [filteredStatusStyles, activeStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="space-y-4 2xl:space-y-6">
        {/* header */}
        <div className="flex flex-col space-y-2 2xl:space-y-2">
          <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
            訂單管理
          </h1>
        </div>

        {/* 分類查詢 */}
        <div className="space-y-3 rounded-xl bg-white p-3 shadow-custom 2xl:space-y-4 2xl:p-4">
          <div className="space-y-2 2xl:space-y-4">
            <label className="block text-sm font-medium text-gray-700 2xl:mb-2">
              訂單類型 {orderType}
            </label>
            <div className="flex items-center space-x-3 2xl:space-x-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  // readOnly
                  // label="選擇日期"
                  value={datePickerValue}
                  onChange={(newValue) => setDatePickerValue(newValue)}
                  slotProps={{
                    textField: {
                      color: 'secondary',
                      size: isLargeScreen ? 'medium' : 'small',
                    },
                  }}
                />
              </LocalizationProvider>
              <div className="flex w-fit rounded-xl bg-gray-100 p-1 2xl:p-1.5">
                {[
                  { key: 'all', label: '全部' },
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
            </div>
          </div>

          <div className="space-y-2 2xl:space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              訂單分類
            </label>
            <div className="flex items-center space-x-3 2xl:space-x-4">
              {filteredStatusStyles.map((style) => {
                const isActive = activeStatus === style.status;
                return (
                  <button
                    key={style.status}
                    type="button"
                    onClick={() => setActiveStatus(style.status)}
                    className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium 2xl:text-base"
                    style={{
                      backgroundColor: isActive ? style.bg : '#ffffff',
                      borderColor: isActive ? style.border : '#ccc',
                      color: style.text,
                      opacity: isActive ? 1 : 0.65,
                    }}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: isActive ? style.border : '#ccc',
                      }}
                    />
                    {style.label}({style.count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 分隔線 */}
        <hr className="border-t border-gray-200" />

        {/* 訂單列表 */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {/* loading 骨架 */}
            {isPending ? (
              [1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative flex flex-col gap-y-2 rounded-xl bg-white p-4 shadow-custom"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Skeleton width={16} height={16} />
                      <Skeleton width={120} height={16} />
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* 訂餐明細骨架 */}
                  <div className="space-y-3">
                    <div className="rounded-xl bg-gray-100 p-4">
                      <div className="mb-3">
                        <Skeleton width={100} height={16} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <Skeleton width={120} height={12} />
                            <Skeleton width={80} height={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 總金額骨架 */}
                  <div className="flex justify-between px-3">
                    <Skeleton width={60} height={20} />
                  </div>

                  <hr className="border-gray-200" />

                  {/* 底部操作區骨架 */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Skeleton width={90} height={32} />
                      <Skeleton width={90} height={32} className="ml-auto" />
                    </div>
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="col-span-3 flex flex-col items-center justify-center">
                <BiSolidError className="text-[50px] text-error 2xl:text-[100px]" />
                <p className="text-lg text-grey-dark 2xl:text-2xl">
                  係統錯誤，請稍後再試 !
                </p>
              </div>
            ) : !ordersData || ordersData.length === 0 ? (
              <div className="flex items-center justify-start text-lg text-grey">
                <MdErrorOutline />
                <p className="ml-1">查無相關訂單 !</p>
              </div>
            ) : (
              <>
                {filteredOrdersData.map((order: Orders) => {
                  const waitingTimeObj = isPendingOrder(order)
                    ? calculateWaiting(order.createdAt)
                    : null;
                  return (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onShowSnackbar={handleShowSnackbar}
                      waitingTimeObj={waitingTimeObj}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
      {/* 全域 Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <p className="text-md flex items-center justify-center gap-1 rounded-xl bg-secondary px-5 py-1.5 text-lg text-white">
          <FaRegCheckCircle />
          <span>{snackbarMessage}</span>
        </p>
      </Snackbar>
    </>
  );
}
export default OrderManagement;
