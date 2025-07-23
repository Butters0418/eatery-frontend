// 商品資料
export interface Product {
  _id?: string; // MongoDB 的 id
  productId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  addons: AddonGroup[] | null;
}

// 商品資料 - 加料群組
export interface AddonGroup {
  group: string;
  options: AddonOption[];
}

// 商品資料 - 加料群組 - 加料選項
export interface AddonOption {
  name: string;
  price: number;
  selected?: boolean;
}

// 商品資料 - 加入複合 id (用於額外判斷同商品但配料不同的情況) : 尚未加入購物車前
export interface ProductWithCompositeId extends Product {
  compositeId: string;
}

// 商品資料 - 加入數量 : 加入購物車後
export interface ProductWithQty extends ProductWithCompositeId {
  qty: number;
}

// 購物車中的訂單資料
export interface OrderPayload {
  orderType: '內用' | '外帶';
  tableId: string | null;
  tableToken: string | null;
  orderList: OrderGroup[];
}
// 購物車中的訂單資料 - 單次點餐
export interface OrderGroup {
  itemCode?: string; // 由 api 回傳生成
  item: OrderItem[];
}

// 購物車中的訂單資料 - 單次點餐商品
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  compositeId: string | null;
  addons: AddonGroup[] | null;
}

// 訂單查詢 api 回傳資料
export interface OrderReceipt {
  _id: string;
  orderType: string;
  orderCode: string;
  tableId: { _id: string; tableNumber: number };
  orderList: OrderGroup[];
  totalPrice: number;
  createdAt: string;
}

// 訂單查詢 api 回傳資料 - 格式化後前端使用
export interface FormattedReceipt {
  createdAt: string;
  orderId: string;
  orderType: string;
  tableNumber: number;
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
