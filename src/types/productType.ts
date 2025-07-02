// 商品型別
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isPopular: boolean;
  addons?: AddonGroup[];
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
}

// 商品與數量的結合型別
export interface ProductWithQuantity extends Product {
  quantity: number;
}
