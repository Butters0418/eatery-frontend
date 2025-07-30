import { create } from 'zustand';
import { FormattedReceipt } from '../types/productType';

interface ReceiptStore {
  receipt: FormattedReceipt | null;
  isReceiptOpen: boolean;
  setIsReceiptOpen: (open: boolean) => void;
  setReceipt: (receipt: FormattedReceipt) => void;
}

export const useReceiptStore = create<ReceiptStore>((set) => ({
  receipt: null,
  isReceiptOpen: false,
  setIsReceiptOpen: (open) => set({ isReceiptOpen: open }),
  setReceipt: (receipt: FormattedReceipt) => set({ receipt }),
}));
