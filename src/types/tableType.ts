enum Status {
  Available = '空閒',
  InUse = '使用中',
}

interface TableOrderInfo {
  isAllServed: boolean;
  isPaid: boolean;
  isComplete: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum DineInStatus {
  Idle = '空閒',
  Preparing = '備餐中',
  Eating = '用餐中',
  Cleaning = '整理中',
}

export interface Table {
  _id: string;
  tableNumber: number;
  status: Status;
  currentOrder: string | null;
  tableToken: string;
  orderInfo: null | TableOrderInfo;
}
