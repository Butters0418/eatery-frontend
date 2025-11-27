import {
  BroadcastEventType,
  BroadcastPayloadMap,
  OrderSummaryPayload,
} from '../services/socketClient';

const getOrderLocationLabel = (payload: OrderSummaryPayload) => {
  if (payload.orderType === '內用') {
    if (typeof payload.tableNumber === 'number') {
      return `${payload.tableNumber}桌`;
    }
    return payload.orderCode;
  }
  return payload.orderCode;
};

export const buildSocketSnackbarMessage = (
  eventType: BroadcastEventType,
  payload: BroadcastPayloadMap[BroadcastEventType],
) => {
  const locationLabel = getOrderLocationLabel(payload);

  switch (eventType) {
    case 'newOrder':
      return `${payload.orderType} 有新訂單！ ${locationLabel}`;
    case 'newItem':
      return `${payload.orderType} ${locationLabel} 有加點項目！`;
    case 'orderUpdated':
      return `${payload.orderType} ${locationLabel} 餐點項目有更新！`;
    case 'deleteOrder': {
      const reason =
        'reason' in payload && payload.reason ? ` 原因：${payload.reason}` : '';
      return `${payload.orderType} ${locationLabel} 訂單已刪除！${reason}`;
    }
    case 'deleteOrderItem':
      return `${payload.orderType} ${locationLabel} 餐點項目已刪除！`;
    case 'itemServed': {
      const itemPayload = payload as BroadcastPayloadMap['itemServed'];
      const statusText = itemPayload.isServed ? '已出餐' : '取消出餐';
      const itemContext =
        itemPayload.orderType === '內用'
          ? `${locationLabel} ${itemPayload.itemCode}`
          : `${itemPayload.itemCode}`;
      return `${itemPayload.orderType} ${itemContext} ${statusText}！`;
    }
    case 'orderPaid': {
      const paidPayload = payload as BroadcastPayloadMap['orderPaid'];
      const statusText = paidPayload.isPaid ? '已結帳' : '取消結帳';
      return `${paidPayload.orderType} ${locationLabel} ${statusText}！`;
    }
    case 'orderCompleted':
      return `${payload.orderType} ${locationLabel} 訂單已完成！`;
    default:
      return null;
  }
};
