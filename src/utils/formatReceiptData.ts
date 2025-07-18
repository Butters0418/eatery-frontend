import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-tw'; // 載入繁體中文
dayjs.locale('zh-tw');
dayjs.extend(utc);
dayjs.extend(timezone);

import {
  AddonGroup,
  AddonOption,
  OrderItem,
  OrderGroup,
  OrderReceipt,
  FormattedReceipt,
} from '../types/productType';

// 訂單明轉為前端使用資料
export const formatReceiptData = (order: OrderReceipt): FormattedReceipt => {
  return {
    createdAt: dayjs(order.createdAt)
      .tz('Asia/Taipei')
      .format('YYYY年M月D日 A hh:mm'),
    orderId: order._id,
    orderType: order.orderType,
    tableNumber: order.tableId.tableNumber,
    totalPrice: order.totalPrice,
    orderList: order.orderList.map((group: OrderGroup) => {
      let subTotal = 0;

      const item = group.item.map((i: OrderItem) => {
        // 取出選擇的配料名稱
        const selectedOptions: string[] = [];
        let addonPrice = 0;
        // 計算配料價格
        i.addons?.forEach((addonGroup: AddonGroup) => {
          addonGroup.options.forEach((opt: AddonOption) => {
            if (opt.selected) {
              selectedOptions.push(opt.name);
              addonPrice += opt.price;
            }
          });
        });

        const uniPriceWithAddons = i.price + addonPrice;

        subTotal += uniPriceWithAddons * i.qty;
        return {
          productId: i.productId,
          name: i.name,
          uniPriceWithAddons,
          qty: i.qty,
          addonsText:
            selectedOptions.length > 0 ? selectedOptions.join(' / ') : null,
          compositeId: i.compositeId ?? '',
        };
      });
      return {
        itemCode: group.itemCode ?? '', // 若 OrderGroup 沒有 itemCode 屬性則給空字串
        item,
        subTotal,
      };
    }),
  };
};
