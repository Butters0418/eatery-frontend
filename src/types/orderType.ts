export enum OrderType {
  ALL = 'all',
  DINE_IN = 'dineIn',
  TAKEOUT = 'takeout',
}

export enum OrderStatus {
  ALL = 'all', // 所有狀態 (內用/外帶)
  PENDING = 'pending', // 處理中 (內用:未結帳未出餐 ; 外帶 : 已結帳待出餐)
  SERVED_UNPAID = 'servedUnpaid', // 待結帳 (內用:已出餐未結帳)
  SERVED_PAID = 'servedPaid', // 待確認完成 (內用/外帶)
  COMPLETED = 'completed', // 已完成 (內用/外帶)
  DELETED = 'deleted', // 已刪除 (內用/外帶)
}

// 需要從 productType 引入的相關介面
import { OrderGroup } from './productType';

// 訂單查詢 api 回傳資料
export interface Orders {
  _id: string;
  orderType: string;
  orderCode: string;
  tableId?: { _id: string; tableNumber: number };
  orderList: OrderGroup[];
  totalPrice: number;
  createdAt: string;
  isAllServed: boolean;
  isPaid: boolean;
  isComplete: boolean;
  isDeleted: boolean;
}

// 訂單查詢 api 回傳資料 - 格式化後前端使用
export interface FormattedReceipt {
  createdAt: string;
  orderId: string;
  orderType: string;
  tableNumber?: number;
  totalPrice: number;
  orderList: FormattedOrderGroup[];
}

// 訂單查詢 api 回傳資料 - 格式化後前端使用 - 單次點餐
export interface FormattedOrderGroup {
  itemCode: string;
  item: FormattedOrderItem[];
  subTotal: number;
}

// 訂單查詢 api 回傳資料 - 商品
export interface FormattedOrderItem {
  productId: string;
  name: string;
  uniPriceWithAddons: number;
  qty: number;
  addonsText: string | null;
  compositeId: string;
}
