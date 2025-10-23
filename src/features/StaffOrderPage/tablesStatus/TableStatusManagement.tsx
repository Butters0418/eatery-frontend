import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

// Hooks
import { useTableQuery } from '../../../hooks/useTableOperations';
import { useAllOrdersQuery } from '../../../hooks/useOrderOperations';

// Stores
import useTableStore from '../../../stores/useTableStore';
import useOrdersStore from '../../../stores/useOrdersStore';

// Components
import OrderCard from '../components/OrderCard';

// Types
import { Orders } from '../../../types/orderType';
import { Table, DineInStatus } from '../../../types/tableType';

// Icons
import { BiSolidError } from 'react-icons/bi';
import { MdErrorOutline } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';
import { iconTable, iconPan, iconEating, iconSpray } from '../../../assets';

// 初始化 dayjs 中文語言包
dayjs.locale('zh-tw');

function TableStatusManagement() {
  // ===== Store Hooks =====
  const { ordersData } = useOrdersStore();
  const tables = useTableStore((state) => state.tables);
  useTableQuery();

  // ===== 狀態管理 =====
  const [currentTable, setCurrentTable] = useState<number>(0); // 0代表全部桌況
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [now, setNow] = useState(dayjs());

  const today = dayjs().format('YYYY-MM-DD');
  const { isError, isPending } = useAllOrdersQuery(today);
  const navigate = useNavigate();
  // 顯示 Snackbar 並設定訊息
  const handleShowSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // 關閉 Snackbar
  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 篩選並排序訂單資料
  const filteredOrdersData = useMemo(() => {
    if (!ordersData) return [];

    return ordersData
      .filter((order) => {
        // 篩選出目前內用訂單
        if (order.orderType !== '內用' || order.isComplete || order.isDeleted)
          return false;

        // 篩選出指定桌號的訂單
        if (currentTable !== 0) {
          return order.tableId?.tableNumber === currentTable;
        }
        return true;
      })
      .sort((a, b) => {
        const tableA = a.tableId?.tableNumber ?? 0;
        const tableB = b.tableId?.tableNumber ?? 0;
        return tableA - tableB;
      });
  }, [ordersData, currentTable]);

  // 計算等待時間的函數
  const calculateWaiting = (createdAt: string | Date) => {
    const orderTime = dayjs(createdAt);
    const diffInMinutes = now.diff(orderTime, 'minute');

    if (diffInMinutes < 60) {
      return {
        diffInText: diffInMinutes > 0 ? `${diffInMinutes} 分` : '剛剛',
        diffInMinutes: diffInMinutes,
      };
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return {
        diffInText: minutes > 0 ? `${hours} 時 ${minutes} 分` : `${hours} 時`,
        diffInMinutes: diffInMinutes,
      };
    }
  };

  // 判斷是否為處理中的訂單(決定等待時間是否顯示)
  const isPendingOrder = (order: Orders) => {
    if (order.isDeleted || order.isComplete) return false;
    if (!order.isAllServed && !order.isPaid) return true;
    return false;
  };

  // 判斷桌桌位狀態
  const getTableStatus = (table: Table): DineInStatus => {
    if (table.status === '空閒') {
      return DineInStatus.Idle;
    } else {
      if (table.orderInfo) {
        if (!table.orderInfo.isAllServed) {
          return DineInStatus.Preparing;
        } else {
          if (!table.orderInfo.isPaid) {
            return DineInStatus.Eating;
          } else if (!table.orderInfo.isComplete) {
            return DineInStatus.Cleaning;
          }
        }
      }
    }
    return DineInStatus.Idle;
  };

  // 桌位狀態對應資訊
  const tableInfo = {
    [DineInStatus.Idle]: {
      icon: null,
      orderButtonText: '點餐',
    },
    [DineInStatus.Preparing]: {
      icon: iconPan,
      orderButtonText: '加點',
    },
    [DineInStatus.Eating]: {
      icon: iconEating,
      orderButtonText: '加點',
    },
    [DineInStatus.Cleaning]: {
      icon: iconSpray,
      orderButtonText: null,
    },
  };

  // 前往點餐頁面 route 並帶入桌號參數
  const startOrder = (tableNumber: number) => {
    navigate(`/order-page/order-creation?tableNumber=${tableNumber}`);
  };

  // 每分鐘更新當前時間
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="space-y-4 2xl:space-y-6">
        <div className="flex flex-col space-y-2 2xl:space-y-2">
          <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
            內用桌況
          </h1>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-custom 2xl:p-4">
          <ul className="grid max-w-[1400px] grid-cols-3 gap-3 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-4">
            {tables?.map((table) => {
              const tableStatus = getTableStatus(table);
              return (
                <li
                  key={table._id}
                  className="relative overflow-hidden rounded-lg border"
                >
                  <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col p-1 xl:p-2">
                    {/* top */}
                    <div className="flex w-full items-center justify-between border-b pb-[3%]">
                      <h3 className="font-bold text-grey 2xl:text-lg">
                        {table.tableNumber} 桌
                      </h3>
                      {/* 入場時間 */}
                      {table.orderInfo &&
                        tableStatus !== DineInStatus.Cleaning && (
                          <p className="text-sm text-grey lg:text-sm">
                            用餐時間 :
                            {
                              calculateWaiting(table.orderInfo.createdAt)
                                .diffInText
                            }
                          </p>
                        )}
                    </div>

                    {/* middle  桌面狀態 icon */}
                    <div className="mt-[4%] flex flex-col items-center">
                      <p className="text-sm text-grey lg:text-base">
                        {tableStatus}
                      </p>
                      {tableStatus !== DineInStatus.Idle && (
                        <img
                          className="absolute top-[5%] w-3/5"
                          src={tableInfo[tableStatus].icon}
                          alt={tableStatus}
                        />
                      )}
                    </div>
                    {/* bot order button */}
                    {tableStatus !== DineInStatus.Cleaning && (
                      <button
                        className="ml-auto mt-auto h-[5vw] w-[5vw] rounded-full border border-primary-light bg-[#FFF3ED]/95 text-primary-dark shadow-custom lg:h-14 lg:w-14 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14"
                        onClick={() => startOrder(table.tableNumber)}
                      >
                        <span className="text-[1.7vw] font-bold text-primary-dark lg:text-base">
                          {tableInfo[tableStatus].orderButtonText}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="p-[5%] pb-0">
                    <img
                      src={iconTable}
                      alt="table"
                      className={`${
                        tableStatus === DineInStatus.Cleaning &&
                        'opacity-50 saturate-0'
                      }`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="space-y-2 2xl:space-y-4">
            <p className="block text-sm font-medium text-gray-700">桌位訂單</p>
            <div className="flex items-center space-x-3 2xl:space-x-4">
              <button
                type="button"
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium 2xl:text-base ${'border-[#3CAAA5] bg-[#EAF8F7] text-[#3CAAA5]'} ${currentTable === 0 ? 'opacity-100' : 'opacity-65'} `}
                onClick={() => setCurrentTable(0)}
              >
                全部訂單
              </button>
              {tables &&
                tables.map((table) => {
                  const isDisabled = table.currentOrder == null;
                  return (
                    <button
                      key={table.tableNumber}
                      type="button"
                      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium 2xl:text-base ${isDisabled ? 'pointer-events-none border-[#6B7280] bg-[#F7F7F7] text-[#6B7280]' : 'border-[#3CAAA5] bg-[#EAF8F7] text-[#3CAAA5]'} ${currentTable === table.tableNumber ? 'opacity-100' : 'opacity-65'}`}
                      onClick={() => setCurrentTable(Number(table.tableNumber))}
                    >
                      {table.tableNumber} 桌
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
export default TableStatusManagement;
