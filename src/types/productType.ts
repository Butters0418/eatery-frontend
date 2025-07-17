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
