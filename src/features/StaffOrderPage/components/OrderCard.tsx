// React 核心庫
import { useState } from 'react';

// 第三方庫 - MUI 組件
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useMediaQuery } from '@mui/material';

// 第三方庫 - React Icons
import { PiBowlFoodFill } from 'react-icons/pi';
import { BsBagCheckFill, BsThreeDots } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';
import { IoMdTime } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa6';
import { BiDish } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';

// 類型定義
import { Orders } from '../../../types/orderType';
import { OrderGroup } from '../../../types/productType';

// 工具函式
import { formatNumber } from '../../../utils/formatNumber';
import { calculatePriceFromCart } from '../../../utils/calculateItemPrice';
import { addonsToString } from '../../../utils/addonsToString';

// Component
import OrderConfirmDialog from './OrderConfirmDialog';
import EditOrderItemDialog from './EditOrderItemDialog';
import ErrorDialog from './ErrorDialog';

// 自訂 hooks
import {
  useDeleteOrderItem,
  useDeleteOrder,
  useUpdateItemServeStatus,
  useUpdateOrderPaymentStatus,
  useUpdateOrderCompletionStatus,
} from '../../../hooks/useOrderOperations';

// ===== 類型定義 =====
interface OrderCardProps {
  order: Orders;
  onShowSnackbar: (message: string) => void;
  waitingTimeObj?: { diffInText: string; diffInMinutes: number } | null;
}

function OrderCard({ order, onShowSnackbar, waitingTimeObj }: OrderCardProps) {
  // ===== 狀態管理 =====
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // 當前開啟的選單 ID
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false); // 確認對話框開啟狀態

  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null); // 選中的子訂單
  const [confirmDialogType, setConfirmDialogType] = useState<
    'deleteItem' | 'deleteOrder' | 'completeOrder' | null
  >(null); // 判斷確認對話框類型
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false); // 錯誤對話框開啟狀態
  const [errorMessage, setErrorMessage] = useState<string>(''); // 錯誤訊息
  // 新增編輯對話框狀態
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState<OrderGroup | null>(
    null,
  );
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  // ===== 自訂 hooks =====
  const { mutate: deleteOrderItemMutation, isPending: isDeleteItemPending } =
    useDeleteOrderItem();

  const { mutate: deleteOrderMutation, isPending: isDeleteOrderPending } =
    useDeleteOrder();

  const { mutate: updateItemServeStatusMutation } = useUpdateItemServeStatus();

  const { mutate: updateOrderPaymentStatusMutation } =
    useUpdateOrderPaymentStatus();

  const {
    mutate: updateOrderCompletionStatusMutation,
    isPending: isCompleteOrderPending,
  } = useUpdateOrderCompletionStatus();

  // ===== 事件處理函式 =====

  // 處理(...)選單開啟/關閉傳入 itemCode
  const handleActionMenuToggle = (itemCode: string) => {
    setOpenMenuId(openMenuId === itemCode ? null : itemCode);
  };

  // 關閉(...)選單
  const handleActionMenuClose = () => {
    setOpenMenuId(null);
  };

  // 關閉 confirm dialog 框
  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setTimeout(() => {
      setSelectedItemCode(null);
      setConfirmDialogType(null);
    }, 200);
  };

  // 處理編輯項目
  const handleEditItem = (itemCode: string) => {
    const itemList = order.orderList.find((item) => item.itemCode === itemCode);
    if (itemList) {
      setSelectedItemList(itemList);
      setIsEditDialogOpen(true);
    }
    handleActionMenuClose();
  };

  // 關閉編輯對話框
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedItemList(null);
  };

  // 編輯成功
  const handleEditSuccess = (message: string) => {
    onShowSnackbar(message);
  };

  // 刪除子訂單
  const handleDeleteItem = (itemCode: string) => {
    setSelectedItemCode(itemCode);
    setConfirmDialogType('deleteItem');
    setIsConfirmDialogOpen(true);
    handleActionMenuClose();
  };

  // 確認刪除子訂單
  const handleConfirmDeleteItem = () => {
    if (selectedItemCode) {
      deleteOrderItemMutation(
        { orderId: order._id, itemCode: selectedItemCode },
        {
          onSuccess: () => {
            handleConfirmDialogClose();
            onShowSnackbar('子訂單已刪除！');
            console.log('刪除子訂單成功');
          },
        },
      );
    }
  };

  // 刪除整張訂單
  const handleDeleteOrder = () => {
    setConfirmDialogType('deleteOrder');
    setIsConfirmDialogOpen(true);
  };

  // 確認刪除整張訂單
  const handleConfirmDeleteOrder = () => {
    deleteOrderMutation(
      { orderId: order._id },
      {
        onSuccess: () => {
          handleConfirmDialogClose();
          onShowSnackbar('訂單已刪除！');
          console.log('刪除訂單成功');
        },
        onError: (err) => {
          handleConfirmDialogClose();
          if (axios.isAxiosError(err)) {
            setErrorMessage(err.response?.data.message);
          } else {
            setErrorMessage('發生未知錯誤，請稍後再試。');
          }
          setIsErrorDialogOpen(true);
        },
      },
    );
  };

  // 送餐狀態切換
  const handleServeStatusChange = (itemCode: string, isServed: boolean) => {
    updateItemServeStatusMutation(
      { orderId: order._id, itemCode, isServed },
      {
        onSuccess: () => {
          handleActionMenuClose();
          console.log('更新送餐狀態成功');
        },
      },
    );
  };

  // 結帳狀態更新
  const handleUpdatePaymentStatus = (isPaid: boolean) => {
    updateOrderPaymentStatusMutation(
      { orderId: order._id, isPaid },
      {
        onSuccess: () => {
          console.log('更新結帳狀態成功');
        },
      },
    );
  };

  // 完成訂單
  const handleCompleteOrder = () => {
    setConfirmDialogType('completeOrder');
    setIsConfirmDialogOpen(true);
  };

  // 關閉錯誤對話框
  const handleErrorDialogClose = () => {
    setIsErrorDialogOpen(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 200);
  };

  // 確認完成訂單
  const handleConfirmCompleteOrder = () => {
    updateOrderCompletionStatusMutation(
      { orderId: order._id },
      {
        onSuccess: () => {
          handleConfirmDialogClose();
          onShowSnackbar('訂單已完成！');
          console.log('訂單已完成');
        },
      },
    );
  };

  // ===== 其他變數與函式 =====
  // 根據訂單類型決定圖示
  const OrderIcon =
    order.orderType === '內用' ? PiBowlFoodFill : BsBagCheckFill;
  const isDineIn = order.orderType === '內用';

  // dialog 配置
  const dialogConfig = {
    deleteItem: {
      title: '刪除子訂單',
      message: `確認要刪除子訂單 ${selectedItemCode} 嗎？`,
      buttonText: '確定刪除',
      isPending: isDeleteItemPending,
      onConfirm: handleConfirmDeleteItem,
      snackbarMessage: '子訂單已刪除！',
    },
    deleteOrder: {
      title: '刪除整張訂單',
      message: `確認要刪除訂單 ${order.orderCode} 嗎？`,
      buttonText: '確定刪除',
      isPending: isDeleteOrderPending,
      onConfirm: handleConfirmDeleteOrder,
      snackbarMessage: '訂單已刪除！',
    },
    completeOrder: {
      title: '完成訂單',
      message: `確認要將訂單 ${order.orderCode} 設為完成嗎？`,
      buttonText: '確定完成',
      isPending: isCompleteOrderPending,
      onConfirm: handleConfirmCompleteOrder,
      snackbarMessage: '訂單已完成！',
    },
  };

  const currentDialogConfig = confirmDialogType
    ? dialogConfig[confirmDialogType]
    : null;

  return (
    <>
      <div
        className={`relative flex flex-col gap-y-2 rounded-xl bg-white p-3 shadow-custom 2xl:p-4 ${
          !order.isDeleted && !order.isComplete ? '' : 'pointer-events-none'
        } `}
      >
        {!order.isDeleted && !order.isComplete && (
          <button
            className="absolute -right-2.5 -top-2.5 overflow-hidden rounded-full shadow-custom"
            onClick={handleDeleteOrder}
          >
            <IoCloseSharp className="bg-white p-1.5 text-3xl text-error-light 2xl:text-4xl" />
          </button>
        )}

        {/* 訂單標題 */}
        <h3 className="flex justify-between text-base">
          <p className="flex items-center font-bold">
            <OrderIcon className="mr-1.5" />
            {order.orderType}
            {isDineIn && ` (${order?.tableId?.tableNumber} 桌) `}:{' '}
            {order.orderCode}
          </p>

          {waitingTimeObj && (
            <p
              className={`mr-2 flex items-center 2xl:mr-3 ${waitingTimeObj.diffInMinutes >= 30 ? 'text-error' : 'text-grey'}`}
            >
              <IoMdTime className="mr-1.5" />
              {waitingTimeObj.diffInText}
            </p>
          )}
        </h3>

        <hr />

        {/* 訂餐明細 */}
        <div>
          {order.orderList.map((itemList) => {
            const isMenuOpen = openMenuId === itemList.itemCode;

            return (
              <div
                className={`mt-2 rounded-xl p-3 transition duration-150 2xl:mt-3 2xl:p-4 ${itemList.isServed ? 'bg-secondary-light' : 'bg-grey-light'}`}
                key={order._id + itemList.itemCode}
              >
                {/* 單次點餐標題與操作選單 */}
                <h4 className="mb-2 flex h-7 items-center justify-between font-bold text-grey-dark 2xl:mb-3">
                  <p>訂單 #{itemList.itemCode}</p>

                  {/* 操作選單按鈕 */}
                  {!order.isDeleted && !order.isComplete && (
                    <button
                      id={`menu-button-${itemList.itemCode}`}
                      onClick={() =>
                        handleActionMenuToggle(itemList.itemCode || '')
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white"
                    >
                      <BsThreeDots className="text-grey" />
                    </button>
                  )}

                  {/* 操作選單 */}
                  <Menu
                    anchorEl={
                      isMenuOpen
                        ? document.getElementById(
                            `menu-button-${itemList.itemCode}`,
                          )
                        : null
                    }
                    open={isMenuOpen}
                    onClose={handleActionMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    slotProps={{
                      paper: {
                        className: '!shadow-custom',
                      },
                      list: {
                        'aria-labelledby': `menu-button-${itemList.itemCode}`,
                      },
                    }}
                  >
                    <MenuItem
                      disabled={
                        order.orderType === '內用' && order.isPaid === true
                      }
                      onClick={() =>
                        handleServeStatusChange(
                          itemList.itemCode || '',
                          !itemList.isServed,
                        )
                      }
                    >
                      <BiDish className="mr-3 text-grey-dark" />
                      <p className="text-grey-dark">
                        {itemList.isServed ? '取消送餐' : '確認送餐'}
                      </p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleEditItem(itemList.itemCode || '')}
                      disabled={itemList.isServed}
                    >
                      <MdEdit className="mr-3 text-grey-dark" />
                      <p className="text-grey-dark">編輯訂單</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteItem(itemList.itemCode || '')}
                      disabled={itemList.isServed}
                    >
                      <FaTrash className="mr-3 text-error" />
                      <p className="text-grey-dark">刪除訂單</p>
                    </MenuItem>
                  </Menu>
                </h4>

                {/* 商品列表 */}
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
        <h3 className="flex justify-between px-2 text-lg font-bold 2xl:px-3 2xl:text-xl">
          <span>總金額 :</span>
          <span>
            <small>$</small>
            {formatNumber(order.totalPrice)}
          </span>
        </h3>

        <hr />

        {/* 操作控制區 */}
        <div className="mt-auto flex items-center px-1 py-1">
          {/* 送餐狀態 */}
          <FormControlLabel
            disabled
            control={
              <Switch
                checked={order.isAllServed}
                size={isLargeScreen ? 'medium' : 'small'}
              />
            }
            label={order.isAllServed ? '已送餐' : '待送餐'}
          />

          {/* 結帳狀態 */}
          <FormControlLabel
            disabled={
              (!order.isAllServed ? true : false) ||
              order.orderType === '外帶' ||
              order.isDeleted ||
              order.isComplete
            }
            control={
              <Switch
                checked={order.isPaid}
                onChange={() => handleUpdatePaymentStatus(!order.isPaid)}
                size={isLargeScreen ? 'medium' : 'small'}
              />
            }
            label={order.isPaid ? '已結帳' : '待結帳'}
          />

          {/* 完成訂單按鈕 */}
          <Button
            className="!ml-auto"
            variant="outlined"
            disabled={
              order.isComplete ||
              order.isDeleted ||
              order.isPaid === false ||
              order.isAllServed === false
            }
            onClick={handleCompleteOrder}
          >
            {order.isComplete ? (
              <p className="flex items-center justify-center text-sm 2xl:text-base">
                <FaCheck className="mr-1" />
                訂單已完成
              </p>
            ) : (
              <p className="text-sm 2xl:text-base">完成訂單</p>
            )}
          </Button>
        </div>
      </div>

      {/* 確認對話框 */}
      <OrderConfirmDialog
        open={isConfirmDialogOpen}
        title={currentDialogConfig?.title || ''}
        message={currentDialogConfig?.message || ''}
        buttonText={currentDialogConfig?.buttonText || ''}
        onClose={handleConfirmDialogClose}
        isPending={currentDialogConfig?.isPending || false}
        onConfirm={currentDialogConfig?.onConfirm || (() => {})}
      />

      {/* 編輯訂單對話框 */}
      <EditOrderItemDialog
        open={isEditDialogOpen}
        orderId={order._id}
        itemList={selectedItemList}
        onClose={handleEditDialogClose}
        onShowSnackbar={onShowSnackbar}
        onSuccess={handleEditSuccess}
      />

      <ErrorDialog
        open={isErrorDialogOpen}
        errorMsg={errorMessage}
        onClose={handleErrorDialogClose}
      />
    </>
  );
}

export default OrderCard;
