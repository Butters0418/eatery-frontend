import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import useAddToCartStore from '../../../stores/useAddToCartStore.ts';
import { formatNumber } from '../../../utils/formatNumber';
interface CheckCartsDialogProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}
function CheckCartsDialog({ cartOpen, setCartOpen }: CheckCartsDialogProps) {
  const { cart, addToCart, removeFromCart } = useAddToCartStore();

  return (
    <Dialog
      open={cartOpen}
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
      onClose={() => setCartOpen(false)}
    >
      <div className="p-3 text-center md:p-8">
        <h3 className="border-b border-gray-200 pb-3 pl-1.5 text-xl font-bold text-gray-900">
          訂單確認
        </h3>
        {cart.length === 0 ? (
          <>
            <p className="my-6 text-lg text-gray-400">目前購物車為空!</p>
            <Button
              onClick={() => setCartOpen(false)}
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
                      key={item.id}
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
                        <p className="text-xs text-gray-400 md:text-sm">
                          加麵 / 加大
                        </p>
                        <p className="mt-auto text-sm font-semibold text-primary md:text-lg">
                          <small>$</small>
                          {item.price}
                        </p>
                      </div>

                      <div className="text-md ml-auto grid h-10 w-24 flex-shrink-0 grid-cols-3 self-center rounded-full bg-white px-1 shadow-md md:w-28 md:px-2 md:text-lg">
                        <button
                          className="flex items-center justify-center"
                          onClick={() => {
                            if (item.id) {
                              removeFromCart(item.id);
                            }
                          }}
                        >
                          {item.quantity > 1 ? (
                            <HiOutlineMinusSm className="text-gray-500" />
                          ) : (
                            <FaRegTrashCan className="text-error-light" />
                          )}
                        </button>
                        <p className="flex items-center justify-center pb-0.5 font-semibold text-secondary">
                          {item.quantity}
                        </p>
                        <button
                          className="flex items-center justify-center"
                          onClick={() => {
                            if (item.quantity < 20) {
                              addToCart(item);
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
                {formatNumber(
                  cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  ),
                )}
              </span>
            </h3>
            <Button
              onClick={() => setCartOpen(false)}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              <p className="text-lg">送出訂單</p>
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
export default CheckCartsDialog;
