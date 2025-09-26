// 第三方庫
import { create } from 'zustand';

// Types
import { Orders } from '../types/orderType';

// ===== 類型定義 =====
interface OrdersStore {
  ordersData: Orders[] | null;
  setOrders: (orders: Orders[]) => void;
}

// 訂單狀態管理 Store
export const useOrdersStore = create<OrdersStore>((set) => ({
  // ===== State =====
  ordersData: null,

  // ===== Actions =====
  setOrders: (orders: Orders[]) => set({ ordersData: orders }),
}));
