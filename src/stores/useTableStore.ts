// 第三方庫
import { create } from 'zustand';

// Types
import { Table } from '../types/tableType';

// ===== 類型定義 =====
interface TableStore {
  tables: Table[] | null;
  setTables: (tables: Table[]) => void;
}

// 桌號狀態管理 Store
const useTableStore = create<TableStore>((set) => ({
  // ===== State =====
  tables: null,

  // ===== Actions =====
  setTables: (tables: Table[]) => set({ tables }),
}));

export default useTableStore;
