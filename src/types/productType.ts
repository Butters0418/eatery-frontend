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
  isServed?: boolean; // 是否已出餐
}

// 購物車中的訂單資料 - 單次點餐商品
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  compositeId?: string | null;
  addons: AddonGroup[] | null;
}
