// 第三方庫
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

// Stores
import { useReceiptStore } from '../../../stores/useReceiptStore.ts';

// Utils
import { formatNumber } from '../../../utils/formatNumber';

// Types
import { FormattedOrderGroup } from '../../../types/productType.ts';

// ===== 類型定義 =====
interface CheckReceiptDialogProps {
  isReceiptOpen: boolean;
  setIsReceiptOpen: (open: boolean) => void;
}

// 訂單明細對話框
function CheckReceiptDialog({
  isReceiptOpen,
  setIsReceiptOpen,
}: CheckReceiptDialogProps) {
  // ===== Store Hooks =====
  const { receipt } = useReceiptStore();

  // ===== 渲染 UI =====
  return (
    <Dialog
      open={isReceiptOpen}
      autoFocus
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: { xs: 500 },
          p: 0,
          m: 0,
        },
        '& .MuiPaper-root': {
          width: { xs: '95%', md: '100%' },
        },
      }}
      fullWidth
      onClose={() => setIsReceiptOpen(false)}
    >
      <div className="p-3 md:p-8">
        <div
          className={`flex items-end border-b border-gray-200 pb-3 ${receipt ? 'justify-between' : 'justify-center'}`}
        >
          <h3 className="pl-1.5 text-center text-xl font-bold leading-none text-gray-900">
            訂單明細
            <span className="ml-2 text-[0.8em] font-normal text-grey">
              {receipt ? `(${receipt.tableNumber}桌)` : ''}
            </span>
          </h3>
          <p className="text-sm leading-none text-grey">
            {receipt ? receipt.createdAt : ''}
          </p>
        </div>
        {receipt ? (
          <>
            {receipt.orderList.map((order: FormattedOrderGroup) => {
              return (
                <div
                  className="mt-3 rounded-xl bg-grey-light p-4"
                  key={order.itemCode}
                >
                  <h4 className="mb-3 font-bold text-grey-dark">
                    訂單 #{order.itemCode}
                  </h4>
                  <ul className="mb-3 space-y-2">
                    {order.item.map((item) => {
                      return (
                        <li
                          className="flex justify-between text-sm"
                          key={item.compositeId}
                        >
                          <div>
                            <span className="text-grey-dark">{item.name}</span>
                            <span className="text-grey"> x {item.qty}</span>
                            {item.addonsText && (
                              <p className="text-xs text-grey">
                                {item.addonsText}
                              </p>
                            )}
                          </div>
                          <span className="text-grey-dark">
                            ${formatNumber(item.uniPriceWithAddons * item.qty)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex justify-between border-t border-dashed pt-3 font-bold">
                    <span>小計 :</span>
                    <span>
                      <small>$</small>
                      {formatNumber(order.subTotal)}
                    </span>
                  </div>
                </div>
              );
            })}

            <h3 className="my-3 flex justify-between border-t border-gray-200 px-3 pt-3 text-lg font-bold md:text-xl">
              <span>總金額 :</span>
              <span className="">
                <small>$</small>
                {formatNumber(receipt.totalPrice)}
              </span>
            </h3>
            <p className="my-4 text-center text-gray-400">
              ※用餐完畢後請至櫃臺結帳，謝謝 !
            </p>
          </>
        ) : (
          <p className="my-6 text-center text-lg text-gray-400">
            ※您尚未點餐，請先點餐後再查看訂單明細!
          </p>
        )}
        {/* 訂單 lists */}

        <Button
          onClick={() => {
            setIsReceiptOpen(false);
          }}
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          <p className="text-lg">關 閉</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default CheckReceiptDialog;
