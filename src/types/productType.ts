// 商品型別
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

// 加料群組
export interface AddonGroup {
  group: string;
  options: AddonOption[];
}

// 加料選項
export interface AddonOption {
  name: string;
  price: number;
  selected?: boolean;
}

// 加入複合 id
export interface ProductWithCompositeId extends Product {
  compositeId: string;
}

// 購物車中的商品與數量
export interface ProductWithQty extends ProductWithCompositeId {
  qty: number;
}

export interface OrderPayload {
  orderType: '內用' | '外帶';
  tableId: string | null;
  tableToken: string | null;
  orderList: OrderGroup[];
}

export interface OrderGroup {
  itemCode?: string;
  item: OrderItem[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  compositeId: string | null;
  addons: AddonGroup[] | null;
}

// api 回傳資料
export interface OrderReceipt {
  _id: string;
  orderType: string;
  orderCode: string;
  tableId: { _id: string; tableNumber: number };
  orderList: OrderGroup[];
  totalPrice: number;
  createdAt: string;
}

export interface FormattedOrderItem {
  productId: string;
  name: string;
  uniPriceWithAddons: number;
  qty: number;
  addonsText: string | null;
  compositeId: string;
}

export interface FormattedOrderGroup {
  itemCode: string;
  item: FormattedOrderItem[];
  subTotal: number;
}

export interface FormattedReceipt {
  createdAt: string;
  orderId: string;
  orderType: string;
  tableNumber: number;
  totalPrice: number;
  orderList: FormattedOrderGroup[];
}
