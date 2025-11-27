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
import EditOrderItemDialog from './EditOrderItemDialog';
import ResultDialog from '../../../components/ResultDialog';
import ConfirmDialog from '../../../components/ConfirmDialog';

// 自訂 hooks
import {
  useDeleteOrderItem,
  useDeleteOrder,
  useUpdateItemServeStatus,
  useUpdateOrderPaymentStatus,
  useUpdateOrderCompletionStatus,
} from '../../../hooks/useOrderOperations';

// Type
import { ResultDialogProps } from '../../../components/ResultDialog';
import { ConfirmDialogProps } from '../../../components/ConfirmDialog';

// ===== 類型定義 =====
interface OrderCardProps {
  order: Orders;
  onShowSnackbar: (message: string) => void;
  waitingTimeObj?: { diffInText: string; diffInMinutes: number } | null;
}

type ResultDialogInfo = Omit<ResultDialogProps, 'onClose'>;
type ConfirmDialogInfo = Omit<ConfirmDialogProps, 'onClose'>;

function OrderCard({ order, onShowSnackbar, waitingTimeObj }: OrderCardProps) {
  // ===== 狀態管理 =====
  const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null); // 選中的子訂單編號
  // 結果燈箱
  const [resultInfo, setResultInfo] = useState<ResultDialogInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
    btnText: '',
  });
  // 確認燈箱
  const [confirmInfo, setConfirmInfo] = useState<ConfirmDialogInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
    btnText: '',
    isPending: false,
    onConfirm: undefined,
  });

  // 編輯對話框狀態
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItemList, setSelectedItemList] = useState<OrderGroup | null>(
    null,
  );

  // 大螢幕判斷
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
    setSelectedItemCode(selectedItemCode === itemCode ? null : itemCode);
  };

  // 關閉(...)選單
  const handleActionMenuClose = () => {
    setSelectedItemCode(null);
  };

  // 關閉 ResultDialog
  const handleResultDialogClose = () => {
    setResultInfo((prev) => ({ ...prev, isOpen: false }));
  };

  // 關閉 ConfirmDialog
  const handleConfirmDialogClose = () => {
    setConfirmInfo((prev) => ({ ...prev, isOpen: false }));
    setSelectedItemCode(null);
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
    handleActionMenuClose();
    setConfirmInfo({
      isOpen: true,
      resultType: 'info',
      title: '刪除子訂單',
      message: `確認要刪除子訂單 ${itemCode} 嗎？`,
      onConfirm: () => handleConfirmDeleteItem(itemCode),
      btnText: '確定刪除',
      isPending: isDeleteItemPending,
    });
  };

  // 確認刪除子訂單
  const handleConfirmDeleteItem = (itemCode: string) => {
    if (itemCode) {
      deleteOrderItemMutation(
        { orderId: order._id, itemCode },
        {
          onSuccess: () => {
            onShowSnackbar('子訂單已刪除！');
          },
          onError: (err) => {
            const errMsg = axios.isAxiosError(err)
              ? err.response?.data.message
              : '發生錯誤，請稍後再試';
            setResultInfo({
              isOpen: true,
              resultType: 'error',
              title: '錯誤',
              message: errMsg,
              btnText: '關 閉',
            });
          },
          onSettled: () => {
            handleConfirmDialogClose();
          },
        },
      );
    }
  };

  // 刪除整張訂單
  const handleDeleteOrder = () => {
    setConfirmInfo({
      isOpen: true,
      resultType: 'info',
      title: '刪除訂單',
      message: `確認要刪除訂單 ${order.orderCode} 嗎？`,
      onConfirm: handleConfirmDeleteOrder,
      btnText: '確定刪除',
      isPending: isDeleteOrderPending,
    });
    handleActionMenuClose();
  };

  // 確認刪除整張訂單
  const handleConfirmDeleteOrder = () => {
    deleteOrderMutation(
      { orderId: order._id },
      {
        onSuccess: () => {
          onShowSnackbar('訂單已刪除！');
        },
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
        onSettled: () => {
          handleConfirmDialogClose();
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
        },
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
      },
    );
  };

  // 結帳狀態更新
  const handleUpdatePaymentStatus = (isPaid: boolean) => {
    updateOrderPaymentStatusMutation(
      { orderId: order._id, isPaid },
      {
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
      },
    );
  };

  // 完成訂單
  const handleCompleteOrder = () => {
    setConfirmInfo({
      isOpen: true,
      resultType: 'info',
      title: '完成訂單',
      message: `確認要將訂單 ${order.orderCode} 設為完成嗎？`,
      onConfirm: handleConfirmCompleteOrder,
      btnText: '確定完成',
      isPending: isCompleteOrderPending,
    });
  };

  // 確認完成訂單
  const handleConfirmCompleteOrder = () => {
    updateOrderCompletionStatusMutation(
      { orderId: order._id },
      {
        onSuccess: () => {
          onShowSnackbar('訂單已完成！');
        },
        onError: (err) => {
          const errMsg = axios.isAxiosError(err)
            ? err.response?.data.message
            : '發生錯誤，請稍後再試';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: errMsg,
            btnText: '關 閉',
          });
        },
        onSettled: () => {
          handleConfirmDialogClose();
        },
      },
    );
  };

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
            {order.orderType === '內用' ? (
              <PiBowlFoodFill className="mr-1.5" />
            ) : (
              <BsBagCheckFill className="mr-1.5" />
            )}
            {order.orderType}
            {order.orderType === '內用' &&
              ` (${order?.tableId?.tableNumber} 桌) `}
            : {order.orderCode}
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
            const isMenuOpen = selectedItemCode === itemList.itemCode;

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

      {/* 編輯訂單對話框 */}
      <EditOrderItemDialog
        open={isEditDialogOpen}
        orderId={order._id}
        itemList={selectedItemList}
        onClose={handleEditDialogClose}
        onShowSnackbar={onShowSnackbar}
        onSuccess={handleEditSuccess}
      />

      {/* 確認對話框 */}
      <ConfirmDialog
        isOpen={confirmInfo.isOpen}
        resultType={confirmInfo.resultType}
        title={confirmInfo.title}
        message={confirmInfo.message}
        btnText={confirmInfo.btnText}
        onClose={handleConfirmDialogClose}
        isPending={confirmInfo.isPending}
        onConfirm={confirmInfo.onConfirm}
      />

      <ResultDialog
        isOpen={resultInfo.isOpen}
        resultType={resultInfo.resultType}
        title={resultInfo.title}
        message={resultInfo.message}
        btnText={resultInfo.btnText}
        onClose={handleResultDialogClose}
      />
    </>
  );
}

export default OrderCard;
