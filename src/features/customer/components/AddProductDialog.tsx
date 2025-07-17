import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Product } from '../../../types/productType';
import useAddToCartStore from '../../../stores/useCartStore.ts';

// 表單數據類型定義
interface FormValues {
  qty: number;
  [key: string]: number | string;
}
interface AddProductDialogProps {
  product: Product;
  productOpen: boolean;
  setProductOpen: (open: boolean) => void;
}

function AddProductDialog({
  product,
  productOpen,
  setProductOpen,
}: AddProductDialogProps) {
  const { addToCart } = useAddToCartStore();
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      qty: 1,
      // 每個 addon 設定默認值為第一個選項
      ...Object.fromEntries(
        (product.addons || []).map((group) => [
          group.group,
          group.options[0].name,
        ]),
      ),
    },
  });

  const formValues = watch();

  // 計算總價格 (含配料)
  const calculateTotalPrice = () => {
    // 基本價格 × 數量
    let total = product.price * formValues.qty;

    // 加上選擇的配料價格
    product.addons?.forEach((group) => {
      const selectedOption = group.options.find(
        (opt) => opt.name === formValues[group.group],
      );
      if (selectedOption) {
        total += selectedOption.price * formValues.qty;
      }
    });
    return total;
  };

  // 計算總價
  const totalPrice = calculateTotalPrice();

  // 加入購物車
  const onSubmit = (data: FormValues) => {
    // 配料加上 selected 屬性
    const addons = (product.addons || []).map((group) => ({
      group: group.group,
      options: group.options.map((option) => ({
        ...option,
        selected: data[group.group] === option.name,
      })),
    }));

    // 建立配料前綴 id (辨別同商品不同配料的情況)
    const addonsPrefix = addons
      .map((group) => group.options.find((opt) => opt.selected)?.name)
      .filter(Boolean)
      .join('_');

    const compositeId = addonsPrefix
      ? `${product.productId}_${addonsPrefix}`
      : product.productId;

    const orderItem = {
      ...product,
      qty: data.qty,
      addons,
      compositeId: compositeId!,
    };

    addToCart(orderItem, data.qty);
  };

  useEffect(() => {
    if (productOpen) {
      // 當對話框開啟時，重置表單值為新的默認值
      reset({
        qty: 1,
        ...Object.fromEntries(
          (product.addons || []).map((group) => [
            group.group,
            group.options[0].name,
          ]),
        ),
      });
    }
  }, [product, productOpen, reset]);

  return (
    <Dialog
      open={productOpen}
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
      onClose={() => setProductOpen(false)}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-60 object-cover md:h-96"
      />
      <div className="p-3 md:p-8">
        <h3 className="flex items-center justify-start gap-x-3 text-xl font-bold text-gray-900">
          <span>{product.name}</span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-xl font-bold text-primary">
            <small>$</small>
            {product.price}
          </span>
        </h3>
        <p className="mt-1 text-gray-400">{product.description}</p>
        {product.isPopular && (
          <p className="mt-auto">
            <span className="-ml-1 mt-2.5 inline-block rounded-full bg-primary-light bg-opacity-20 px-2 py-0.5 text-xs font-semibold text-primary md:text-sm">
              熱門商品
            </span>
          </p>
        )}

        <form
          className="mt-4 grid gap-2 border-t-4 border-gray-100 pt-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 額外加料 */}
          {product.addons?.map((group) => (
            <FormControl key={group.group} fullWidth>
              <p className="font-bold">{group.group}</p>

              <Controller
                name={group.group}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
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

          {/* 數量 */}
          <Controller
            name="qty"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <FormControl variant="outlined" sx={{ width: 100 }}>
                <p className="mb-2.5 font-bold">數量</p>
                <Select
                  {...field}
                  value={Number(field.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-input': { py: 0.6 },
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Button
            type="submit"
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 2, mt: 2 }}
            fullWidth
            onClick={() => {
              setProductOpen(false);
            }}
          >
            <p className="text-lg">
              {/* 計算選了幾項 */}
              新增({formValues.qty})項:{' '}
              <span>
                <small>$</small>
                {totalPrice}
              </span>
            </p>
          </Button>
        </form>
      </div>
    </Dialog>
  );
}

export default AddProductDialog;
