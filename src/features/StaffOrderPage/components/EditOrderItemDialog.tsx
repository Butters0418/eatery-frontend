// React 相關
import { useEffect } from 'react';

// 第三方庫
import { useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Types
import { OrderGroup } from '../../../types/productType';

// Utils
import { formatNumber } from '../../../utils/formatNumber';
import { addonsToString } from '../../../utils/addonsToString';

// Hooks
import {
  useUpdateOrderItem,
  useDeleteOrderItem,
} from '../../../hooks/useOrderOperations';

// Icons
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';

// ===== 類型定義 =====
interface FormValues {
  [key: string]: number | string;
}

interface EditOrderItemDialogProps {
  open: boolean;
  orderId: string | null;
  itemList: OrderGroup | null;
  onClose: () => void;
  onShowSnackbar: (message: string) => void;
  onSuccess: (message: string) => void;
}

function EditOrderItemDialog({
  open,
  orderId,
  itemList,
  onClose,
  onSuccess,
  onShowSnackbar,
}: EditOrderItemDialogProps) {
  // ===== API Hooks =====
  const { mutate: updateOrderItemMutation, isPending: isUpdateOrderPending } =
    useUpdateOrderItem();
  const {
    mutate: deleteOrderItemMutation,
    isPending: isDeleteOrderItemPending,
  } = useDeleteOrderItem();

  // ===== Form Hooks =====
  const { control, handleSubmit, reset, setValue, watch, unregister } =
    useForm<FormValues>();

  // 提交表單
  const onSubmit = (data: FormValues) => {
    if (!orderId || !itemList) return;

    // 更新的項目列表
    const updatedItems = itemList.item
      .map((item) => {
        const newQty = data[`qty-${item.compositeId}`];
        if (newQty === undefined) return null; // 如果沒有數量，表示刪除該項目

        // 處理配料選項
        const updatedAddons =
          item.addons && item.addons.length > 0
            ? item.addons.map((group) => {
                const selectedOptionName =
                  data[`${item.compositeId}-${group.group}`];
                return {
                  ...group,
                  options: group.options.map((opt) => ({
                    ...opt,
                    selected: opt.name === selectedOptionName,
                  })),
                };
              })
            : null;

        // 建立配料前綴 id (辨別同商品不同配料的情況)
        const addonsPrefix =
          updatedAddons !== null
            ? updatedAddons
                .map((group) => group.options.find((opt) => opt.selected)?.name)
                .filter(Boolean)
                .join('_')
            : null;

        const compositeId = addonsPrefix
          ? `${item.productId}_${addonsPrefix}`
          : item.productId;

        return {
          compositeId,
          qty: Number(newQty),
          addons: updatedAddons,
          productId: item.productId,
          name: item.name,
          price: item.price,
        };
      })
      .filter((item) => item !== null); // 過濾掉被刪除的項目

    // 合併最後相同 compositeId 的品項
    const mergedItems = updatedItems.reduce(
      (acc, item) => {
        const existingItem = acc.find(
          (existing) => existing.compositeId === item.compositeId,
        );

        if (existingItem) {
          // 如果已存在相同的 compositeId，合併數量
          existingItem.qty += item.qty;
        } else {
          // 如果不存在，直接添加
          acc.push(item);
        }

        return acc;
      },
      [] as typeof updatedItems,
    );

    if (mergedItems.length === 0 && itemList.itemCode) {
      deleteOrderItemMutation(
        { orderId, itemCode: itemList.itemCode },
        {
          onSuccess: () => {
            onShowSnackbar('子訂單已刪除！');
            onClose();
            console.log('刪除子訂單成功');
          },
          onError: (error: Error) => {
            console.error('刪除子訂單失敗:', error.message);
          },
        },
      );
    } else {
      updateOrderItemMutation(
        {
          orderId,
          itemCode: itemList.itemCode ?? '',
          updatedItems: mergedItems,
        },
        {
          onSuccess: () => {
            onSuccess('訂單項目更新成功');
            onClose();
          },
          onError: (error: Error) => {
            console.error('更新訂單項目失敗:', error.message);
          },
        },
      );
    }
  };

  // 當 itemList 或 open 狀態改變時，重置表單
  useEffect(() => {
    if (itemList && open) {
      // 初始化表單值
      const initialValues: FormValues = {};
      // 為每個項目設置初始數量
      itemList.item.forEach((item) => {
        if (item.compositeId) {
          initialValues[`qty-${item.compositeId}`] = item.qty;
        }
      });
      reset(initialValues);
    }
  }, [itemList, open, reset]);

  if (!itemList || !orderId) return null;

  return (
    <Dialog
      open={open}
      autoFocus
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: { xs: 600 },
          p: 0,
          m: 0,
        },
        '& .MuiPaper-root': {
          width: { xs: '95%', md: '100%' },
        },
      }}
      fullWidth
      maxWidth="md"
      onClose={onClose}
    >
      <div className="p-4 md:p-6">
        <h3 className="mb-4 border-b border-gray-200 pb-3 text-xl font-bold text-gray-900">
          編輯訂單 #{itemList.itemCode}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {itemList.item
            .filter((item) => {
              const currentQty = watch(`qty-${item.compositeId}`);
              return currentQty !== undefined;
            })
            .map((item) => {
              return (
                <div
                  key={item.compositeId}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="flex items-center space-x-2 text-lg font-semibold">
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-400">|</span>
                        <span className="text-xl font-bold text-primary">
                          <small>$</small>
                          {formatNumber(item.price)}
                        </span>
                      </h4>

                      {item.addons && (
                        <p className="text-xs text-gray-400">
                          目前配料: {addonsToString(item.addons, ' / ')}
                        </p>
                      )}
                    </div>
                    <div className="text-md ml-auto grid h-10 w-24 flex-shrink-0 grid-cols-3 self-center rounded-full bg-white px-1 shadow-md md:w-28 md:px-2 md:text-lg">
                      <button
                        type="button"
                        className="flex items-center justify-center"
                        onClick={() => {
                          if (item.compositeId) {
                            const watchedQty = watch(`qty-${item.compositeId}`);
                            const currentQty =
                              Number(watchedQty) || Number(item.qty) || 0;
                            if (currentQty > 1) {
                              // 減少數量
                              setValue(
                                `qty-${item.compositeId}`,
                                currentQty - 1,
                              );
                            } else {
                              // 數量為1時，移除項目
                              unregister(`qty-${item.compositeId}`);
                              // 同時移除相關的配料選項
                              item.addons?.forEach((group) => {
                                unregister(
                                  `${item.compositeId}-${group.group}`,
                                );
                              });
                            }
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
                        {watch(`qty-${item.compositeId}`) || item.qty}
                      </p>
                      <button
                        type="button"
                        className="flex items-center justify-center"
                        onClick={() => {
                          if (item.compositeId) {
                            const watchedQty = watch(`qty-${item.compositeId}`);
                            const currentQty =
                              Number(watchedQty) || Number(item.qty) || 0;
                            if (currentQty < 20) {
                              setValue(
                                `qty-${item.compositeId}`,
                                currentQty + 1,
                              );
                            }
                          }
                        }}
                      >
                        <HiOutlinePlusSm className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  {/* 配料區 */}
                  {item.addons?.map((group) => (
                    <FormControl key={group.group} fullWidth className="!mt-2">
                      <p className="font-bold">{group.group}</p>
                      <Controller
                        name={`${item.compositeId}-${group.group}`}
                        control={control}
                        defaultValue={
                          group.options.find((opt) => opt.selected)?.name || ''
                        }
                        render={({ field }) => (
                          <RadioGroup
                            row
                            {...field}
                            onChange={(_, value) => field.onChange(value)}
                          >
                            {group.options.map((opt) => (
                              <FormControlLabel
                                key={opt.name}
                                value={opt.name}
                                control={<Radio />}
                                label={
                                  <>
                                    {opt.name}{' '}
                                    <span className="text-sm text-grey">
                                      + <small> $</small>
                                      {opt.price}
                                    </span>
                                  </>
                                }
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  ))}
                </div>
              );
            })}

          {/* 操作按鈕 */}
          <div className="flex justify-center space-x-3">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, maxWidth: 380 }}
              fullWidth
              disabled={isUpdateOrderPending || isDeleteOrderItemPending}
            >
              {isUpdateOrderPending || isUpdateOrderPending ? (
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress size="28px" color="inherit" />
                </Box>
              ) : (
                <p className="text-lg">確認更新</p>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export default EditOrderItemDialog;
