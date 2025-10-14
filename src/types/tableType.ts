export enum TableStatus {
  Available = '空閒',
  InUse = '使用中',
}

export interface Table {
  _id: string;
  tableNumber: number;
  status: TableStatus;
  currentOrder: string | null;
  qrImage: string | null;
  tableToken: string;
  canOrder: boolean;
}
