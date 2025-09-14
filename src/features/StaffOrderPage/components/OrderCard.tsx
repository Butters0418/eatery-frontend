import { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';

import { Orders } from '../../../types/orderType';
import { PiBowlFoodFill } from 'react-icons/pi';
import { BsBagCheckFill } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';

import { formatNumber } from '../../../utils/formatNumber';
import { calculatePriceFromCart } from '../../../utils/calculateItemPrice';
import { addonsToString } from '../../../utils/addonsToString';

interface OrderCardProps {
  order: Orders;
}

function OrderCard({ order }: OrderCardProps) {
  const [checked, setChecked] = useState(order.isPaid);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const OrderIcon =
    order.orderType === '內用' ? PiBowlFoodFill : BsBagCheckFill;
  const isDineIn = order.orderType === '內用';
  console.log('orderId', order._id);
  return (
    <div className="relative flex flex-col gap-y-2 rounded-xl bg-white p-4 shadow-custom">
      <button className="absolute -right-2.5 -top-2.5 overflow-hidden rounded-full shadow-custom">
        <IoCloseSharp className="bg-white p-1.5 text-4xl text-error-light" />
      </button>
      {/* header */}
      <h3 className="flex justify-between">
        <p className="flex items-center font-bold">
          <OrderIcon className="mr-1.5" />
          {order.orderType}
          {isDineIn && ` (${order?.tableId?.tableNumber} 桌) `}:{' '}
          {order.orderCode}
        </p>
        <p className="mr-3 flex items-center text-grey">
          <IoMdTime className="mr-1.5" />
          15 分鐘
        </p>
      </h3>
      <hr />
      {/* 訂餐明細 */}
      <div>
        {order.orderList.map((itemList) => {
          return (
            <div
              className="mt-3 rounded-xl bg-grey-light p-4"
              key={order._id + itemList.itemCode}
            >
              <h4 className="mb-3 font-bold text-grey-dark">
                訂單 #{itemList.itemCode}
              </h4>
              <ul className="mb-3 space-y-2">
                {itemList.item.map((item) => {
                  return (
                    <li
                      className="flex justify-between text-sm"
                      key={order._id + itemList.itemCode + item.compositeId}
                    >
                      <div>
                        <span className="text-grey-dark">{item.name}</span>
                        <span className="text-grey"> x {item.qty}</span>
                        {item.addons && (
                          <span className="text-xs text-grey">
                            {' '}
                            {addonsToString(item.addons, ' / ')}
                          </span>
                        )}
                      </div>
                      <span className="text-grey-dark">
                        ${formatNumber(calculatePriceFromCart(item, true))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      {/* 總金額 */}
      <h3 className="flex justify-between px-3 text-lg font-bold md:text-xl">
        <span>總金額 :</span>
        <span className="">
          <small>$</small>
          {formatNumber(order.totalPrice)}
        </span>
      </h3>
      <hr />
      <div className="mt-2 flex items-center">
        <FormControlLabel
          disabled
          control={<Switch checked={order.isAllServed} />}
          label={order.isAllServed ? '送餐完畢' : '待送餐'}
        />
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label={checked ? '已結帳' : '待結帳'}
        />
        <Button className="!ml-auto" variant="outlined">
          完成訂單
        </Button>
      </div>
    </div>
  );
}
export default OrderCard;
