import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Product } from '../../../types/productType';
import { motion, AnimatePresence } from 'framer-motion';
import useAddToCartStore from '../../../stores/useCartStore.ts';

interface CartButtonGroupProps {
  group: string; // div 中區塊位置
  item: Product;
  currentProductId: string | null;
  setCurrentProductId: (id: string | null) => void;
}

function CartButtonGroup({
  group,
  item,
  currentProductId,
  setCurrentProductId,
}: CartButtonGroupProps) {
  const { cart, addToCart, removeFromCart } = useAddToCartStore();

  // 當前商品在購物車中的數量
  const quantity: number =
    cart.find((cartItem) => cartItem.productId === item.productId)?.qty || 0;

  // 當前商品的 groupId (用於判斷展開使用)
  const groupId = item.productId ? `${group}_${item.productId}` : null;

  // +增加商品
  const addItemHandler = (product: Product) => {
    // 如果當前商品數量大於 0 且不是當前選中的商品，則單純打開按鈕選單
    if (quantity > 0 && currentProductId !== groupId) {
      setCurrentProductId(groupId);
      return;
    }
    const newProduct = {
      ...product,
      compositeId: product.productId!,
    };
    setCurrentProductId(groupId);
    addToCart(newProduct, 1);
  };

  // -減少商品
  const removeItemHandler = (compiledId: string) => {
    if (quantity <= 1) {
      setCurrentProductId(null);
    }
    removeFromCart(compiledId);
  };
  return (
    <div
      className="text-md absolute bottom-2 right-2 h-8 w-24 md:h-9 md:w-[108px] md:text-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-tag="product-button-group"
    >
      <motion.div
        className="absolute right-0 top-0 h-full w-9 rounded-full bg-white shadow-lg"
        initial={false}
        animate={{
          width: groupId === currentProductId ? '100%' : '33.3%',
        }}
        transition={{ duration: 0.3 }}
      ></motion.div>
      <button
        className="absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
        onClick={() => {
          addItemHandler(item);
        }}
      >
        {quantity > 0 && currentProductId !== groupId ? (
          <p className="pb-0.5 font-semibold text-secondary">{quantity}</p>
        ) : (
          <HiOutlinePlusSm className="text-gray-500" />
        )}
      </button>
      {/* 數字 */}

      <AnimatePresence>
        {groupId === currentProductId && (
          <motion.p
            className="absolute bottom-0.5 right-1/3 z-20 flex h-full w-1/3 items-center justify-center font-semibold text-secondary"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, delay: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.1, delay: 0 },
            }}
          >
            {quantity}
          </motion.p>
        )}
      </AnimatePresence>

      {/* -1 或垃圾桶 */}
      <AnimatePresence>
        {groupId === currentProductId && (
          <motion.button
            className="absolute right-2/3 z-10 flex h-full w-1/3 items-center justify-center rounded-full"
            onClick={() => {
              if (item.productId) {
                removeItemHandler(item.productId);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, delay: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.1, delay: 0 },
            }}
          >
            {quantity > 1 ? (
              <HiOutlineMinusSm className="text-gray-500" />
            ) : (
              <FaRegTrashCan className="text-error-light" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
export default CartButtonGroup;
