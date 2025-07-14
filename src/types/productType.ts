// 商品型別
export interface Product {
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
