import { useState, useMemo, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-tw';

import { OrderType, OrderStatus } from '../../../types/orderType';

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
    type: OrderType.DINE_IN,
  },
  {
    bg: '#EAF8F7',
    border: '#3CAAA5',
    text: '#3CAAA5',
    label: '未結帳',
    status: OrderStatus.SERVED_UNPAID,
    type: OrderType.DINE_IN,
  },
  {
    bg: '#F0F4F8',
    border: '#607D8B',
    text: '#607D8B',
    label: '已結帳待出餐',
    status: OrderStatus.PAID_PENDING,
    type: OrderType.TAKEOUT,
  },
  {
    bg: '#FFF2E0',
    border: '#C97D42',
    text: '#C97D42',
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

  // 根據 orderType 過濾 statusStyleMap
  const filteredStatusStyles = useMemo(() => {
    if (orderType === OrderType.ALL) {
      return statusStyleMap;
    } else {
      return statusStyleMap.filter(
        (style) => style.type === orderType || style.type === OrderType.ALL,
      );
    }
  }, [orderType]);

  // 若 activeStatus 不在 filteredStatusStyles 中，重設為 ALL
  useEffect(() => {
    if (
      activeStatus !== OrderStatus.ALL &&
      !filteredStatusStyles.some((status) => status.status === activeStatus)
    ) {
      setActiveStatus(OrderStatus.ALL);
    }
  }, [filteredStatusStyles, activeStatus]);
  return (
    <div className="space-y-4 md:space-y-6">
      {/* header */}
      <div className="flex flex-col space-y-4 md:space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          訂單管理
        </h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">共 10 筆訂單</p>
      </div>
      {/* 分類查詢 */}
      <div className="space-y-4 rounded-xl bg-white p-2 shadow-custom md:p-4">
        <div className="space-y-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            訂單類型 {orderType}
          </label>
          <div className="flex items-center space-x-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // readOnly
                // label="選擇日期"
                value={datePickerValue}
                onChange={(newValue) => setDatePickerValue(newValue)}
                slotProps={{
                  textField: { color: 'secondary' },
                }}
              />
            </LocalizationProvider>
            <div className="flex w-fit rounded-xl bg-gray-100 p-1 md:p-1.5">
              {[
                { key: 'all', label: '全部' },
                { key: 'dineIn', label: '內用' },
                { key: 'takeout', label: '外帶' },
              ].map((item) => (
                <button
                  key={item.key}
                  className={`min-h-[44px] touch-manipulation rounded-lg px-4 py-2 text-sm font-medium md:px-6 md:py-2.5 md:text-base ${orderType === item.key && 'bg-white text-secondary shadow-custom'}`}
                  type="button"
                  onClick={() => setOrderType(item.key as OrderType)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            訂單分類
          </label>
          <div className="flex items-center space-x-4">
            {filteredStatusStyles.map((style) => {
              const isActive = activeStatus === style.status;
              return (
                <button
                  key={style.status}
                  type="button"
                  onClick={() => setActiveStatus(style.status)}
                  className="text-md flex items-center gap-2 rounded-lg border px-3 py-1.5 font-medium"
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
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderManagement;
