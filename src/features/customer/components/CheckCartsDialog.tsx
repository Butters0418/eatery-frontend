import { useState } from 'react';

// 第三方庫
import { useQueryClient } from '@tanstack/react-query';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Components
import ResultDialog from '../../../components/ResultDialog.tsx';

// Hooks
import { useSubmitOrder } from '../../../hooks/useOrderOperations.ts';

// Stores
import useCartStore from '../../../stores/useCartStore.ts';

// Utils
import { formatNumber } from '../../../utils/formatNumber';
import { calculatePriceFromCart } from '../../../utils/calculateItemPrice.ts';
import { addonsToString } from '../../../utils/addonsToString.ts';

// Icons
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';

// Type
import { ResultDialogProps } from '../../../components/ResultDialog.tsx';

// ===== 類型定義 =====
// 定義 props 的 interface
interface CheckCartsDialogProps {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

// 對話框內容
type ResultInfo = Omit<ResultDialogProps, 'onClose'>;

// 購物車對話框
function CheckCartsDialog({
  isCartOpen,
  setIsCartOpen,
}: CheckCartsDialogProps) {
  // ===== Store Hooks =====
  const { cart, addToCart, removeFromCart, getTotalPrice, clearCart } =
    useCartStore();

  // ===== API 相關 Hooks =====
  const { mutate: submitOrder, isPending } = useSubmitOrder();
  const queryClient = useQueryClient();

  // ===== State =====
  const [resultInfo, setResultInfo] = useState<ResultInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
  });

  // ===== 事件處理函數 =====
  // submit 訂單
  const submitHandler = async () => {
    submitOrder(undefined, {
      onSuccess: () => {
        setResultInfo((prev) => ({
          ...prev,
          resultType: 'success',
          title: '訂單提交成功!',
          message: '點擊下方查詢訂單明細',
        }));
        queryClient.invalidateQueries({ queryKey: ['orderReceipt'] });
      },
      onError: (error: Error) => {
        console.error('訂單提交失敗:', error);
        setResultInfo((prev) => ({
          ...prev,
          resultType: 'error',
          title: '訂單提交失敗!',
          message: '請重新掃描桌號 QR Code 或聯絡服務人員',
        }));
      },
      onSettled: () => {
        setIsCartOpen(false); // 關閉購物車對話框
        clearCart();
        setTimeout(() => {
          setResultInfo((prev) => ({ ...prev, isOpen: true })); // 開啟訂單提交結果對話框
        }, 300);
      },
    });
  };

  const handleResultDialogClose = () => {
    setResultInfo((prev) => ({ ...prev, isOpen: false }));
  };

  // ===== 渲染 UI =====
  return (
    <>
      <Dialog
        open={isCartOpen}
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
        onClose={() => setIsCartOpen(false)}
      >
        <div className="p-3 text-center md:p-8">
          <h3 className="border-b border-gray-200 pb-3 pl-1.5 text-xl font-bold text-gray-900">
            訂單確認
          </h3>
          {cart.length === 0 ? (
            <>
              <p className="my-6 text-lg text-gray-400">目前購物車為空!</p>
              <Button
                onClick={() => setIsCartOpen(false)}
                variant="outlined"
                color="secondary"
                sx={{ borderRadius: 2 }}
                fullWidth
              >
                <p className="text-lg">關 閉</p>
              </Button>
            </>
          ) : (
            <>
              <ul>
                {cart.length > 0 &&
                  cart.map((item) => {
                    return (
                      <li
                        className="flex items-stretch justify-between border-b border-gray-200 px-1 py-2 text-left"
                        key={item.compositeId}
                      >
                        <img
                          className="h-16 w-[70px] self-center rounded-md object-cover md:h-20 md:w-24"
                          src={item.imageUrl}
                          alt={item.name}
                        />

                        <div className="ml-2 flex flex-col">
                          <h3 className="text-base font-medium md:text-lg">
                            {item.name}
                          </h3>
                          {item.addons && (
                            <p className="text-xs text-gray-400 md:text-sm">
                              {addonsToString(item.addons, ' / ')}
                            </p>
                          )}

                          <p className="mt-auto text-sm font-semibold text-primary md:text-lg">
                            <small>$</small>
                            {calculatePriceFromCart(item, false)}
                          </p>
                        </div>

                        <div className="text-md ml-auto grid h-10 w-24 flex-shrink-0 grid-cols-3 self-center rounded-full bg-white px-1 shadow-md md:w-28 md:px-2 md:text-lg">
                          <button
                            className="flex items-center justify-center"
                            onClick={() => {
                              if (item.compositeId) {
                                removeFromCart(item.compositeId);
                              }
                            }}
                          >
                            {item.qty > 1 ? (
                              <HiOutlineMinusSm className="text-gray-500" />
                            ) : (
                              <FaRegTrashCan className="text-error-light" />
                            )}
                          </button>
                          <p className="flex items-center justify-center pb-0.5 font-semibold text-secondary">
                            {item.qty}
                          </p>
                          <button
                            className="flex items-center justify-center"
                            onClick={() => {
                              if (item.qty < 20) {
                                addToCart(item, 1);
                              }
                            }}
                          >
                            <HiOutlinePlusSm className="text-gray-500" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              <h3 className="mb-10 mt-1.5 pl-2 text-left text-lg font-bold md:mt-4 md:text-xl">
                訂單金額 :{' '}
                <span className="text-primary">
                  <small>$</small>
                  {formatNumber(getTotalPrice())}
                </span>
              </h3>
              <Button
                onClick={submitHandler}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 2 }}
                disabled={isPending}
              >
                {isPending ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress size="28px" color="inherit" />
                  </Box>
                ) : (
                  <p className="text-lg">送出訂單</p>
                )}
              </Button>
            </>
          )}
        </div>
      </Dialog>
      <ResultDialog
        isOpen={resultInfo.isOpen}
        resultType={resultInfo.resultType}
        title={resultInfo.title}
        message={resultInfo.message}
        onClose={handleResultDialogClose}
      />
    </>
  );
}
export default CheckCartsDialog;
