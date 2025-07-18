import { create } from 'zustand';
import { FormattedReceipt } from '../types/productType';

interface ReceiptStore {
  receipt: FormattedReceipt | null;
  setReceipt: (receipt: FormattedReceipt) => void;
}

export const useReceiptStore = create<ReceiptStore>((set) => ({
  receipt: null,
  setReceipt: (receipt: FormattedReceipt) => set({ receipt }),
}));
