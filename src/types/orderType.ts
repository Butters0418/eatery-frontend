export enum OrderType {
  ALL = 'all',
  DINE_IN = 'dineIn',
  TAKEOUT = 'takeout',
}

export enum OrderStatus {
  ALL = 'all', // 所有狀態
  PENDING = 'pending', // 處理中 (內用:未出餐)
  SERVED_UNPAID = 'servedUnpaid', // 未結帳(內用:已出餐未結帳)
  PAID_PENDING = 'paidPending', // 已結帳待出餐 (外帶)
  SERVED_PAID = 'servedPaid', // 待確認完成 (內用/外帶)
  COMPLETED = 'completed', // 已完成
  DELETED = 'deleted', // 已刪除
}
