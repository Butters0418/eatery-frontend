// 第三方庫
import { create } from 'zustand';

// Types
import { FormattedReceipt } from '../types/orderType';

// ===== 類型定義 =====
interface ReceiptStore {
  receipt: FormattedReceipt | null;
  isReceiptOpen: boolean;
  setIsReceiptOpen: (open: boolean) => void;
  setReceipt: (receipt: FormattedReceipt) => void;
}

// 訂單明細狀態管理 Store
const useReceiptStore = create<ReceiptStore>((set) => ({
  // ===== State =====
  receipt: null,
  isReceiptOpen: false,

  // ===== Actions =====
  setIsReceiptOpen: (open) => set({ isReceiptOpen: open }),
  setReceipt: (receipt: FormattedReceipt) => set({ receipt }),
}));

export default useReceiptStore;
