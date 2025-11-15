// React 相關
import { useState, useEffect, useMemo, useCallback } from 'react';

// 第三方庫
import {
  useForm,
  Controller,
  useFieldArray,
  type SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';

// Components
import ResultDialog from '../../../components/ResultDialog';

// Hooks
import {
  useCreateProduct,
  useUpdateProduct,
} from '../../../hooks/useProductOperations';

// Stores
import useProductStore from '../../../stores/useProductStore';
import useAuthStore from '../../../stores/useAuthStore';

// APIs
import { uploadImage } from '../../../apis/uploadApi';

// Schemas
import { menuSchema } from './menuSchema';
import type { MenuFormValues } from './menuSchema';

// Types
import { Product } from '../../../types/productType';
import { ResultDialogProps } from '../../../components/ResultDialog';

// Icons
import { HiOutlinePlusSm, HiOutlineX } from 'react-icons/hi';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdImage } from 'react-icons/md';

// ===== 類型定義 =====
interface EditProductDialogProps {
  isOpen: boolean;
  type: 'new' | 'edit';
  targetProduct: Product | null;
  onClose: () => void;
}

type ProductFormData = MenuFormValues;

type ResultInfo = Omit<ResultDialogProps, 'onClose'>;

function EditProductDialog({
  isOpen,
  type,
  targetProduct,
  onClose,
}: EditProductDialogProps) {
  // ===== Store Hooks =====
  const products = useProductStore((state) => state.products);
  const { token } = useAuthStore();

  // ===== API Hooks =====
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // ===== 狀態管理 =====
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [resultInfo, setResultInfo] = useState<ResultInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
    btnText: '',
  });
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // ===== Form 初始化 =====
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(menuSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      isAvailable: true,
      isPopular: false,
      addons: [],
    },
  });

  // ===== 動態表單管理 (addons) =====
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'addons',
  });

  // ===== 監聽表單值 =====
  const watchImageUrl = watch('imageUrl');

  // ===== 分類處理 =====
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((product) => product.category))];
  }, [products]);

  // ===== 圖片上傳 =====
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    onDrop: useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        if (!token) {
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '錯誤',
            message: '使用者未登入',
            btnText: '關閉',
          });
          return;
        }

        const file = acceptedFiles[0];
        const localPreviewUrl = URL.createObjectURL(file);
        setImagePreview(localPreviewUrl);
        setIsUploadingImage(true);

        try {
          const imageUrl = await uploadImage(file, token);
          setValue('imageUrl', imageUrl, { shouldValidate: true });
          setImagePreview(imageUrl);
        } catch (error) {
          const errMsg = axios.isAxiosError(error)
            ? error.response?.data.message || '圖片上傳失敗'
            : '圖片上傳失敗';
          setResultInfo({
            isOpen: true,
            resultType: 'error',
            title: '上傳失敗',
            message: errMsg,
            btnText: '關閉',
          });
          setImagePreview('');
          setValue('imageUrl', '');
        } finally {
          setIsUploadingImage(false);
        }
      },
      [token, setValue],
    ),
  });

  // ===== Effects =====
  // 監聽對話框開啟，重置表單
  useEffect(() => {
    if (isOpen) {
      if (type === 'new') {
        reset({
          name: '',
          description: '',
          price: 0,
          category: '',
          imageUrl: '',
          isAvailable: true,
          isPopular: false,
          addons: [],
        });
        replace([]); // 清空 addons fields
        setImagePreview('');
        setShowNewCategoryInput(false);
        setNewCategoryInput('');
      } else if (type === 'edit' && targetProduct) {
        reset({
          name: targetProduct.name,
          description: targetProduct.description,
          price: targetProduct.price,
          category: targetProduct.category,
          imageUrl: targetProduct.imageUrl,
          isAvailable: targetProduct.isAvailable,
          isPopular: targetProduct.isPopular,
          addons:
            targetProduct.addons && targetProduct.addons.length > 0
              ? targetProduct.addons
              : [],
        });
        // 如果有 addons，設置到 fields；否則清空
        if (targetProduct.addons && targetProduct.addons.length > 0) {
          replace(targetProduct.addons);
        } else {
          replace([]);
        }
        setImagePreview(targetProduct.imageUrl);
        setShowNewCategoryInput(false);
        setNewCategoryInput('');
      }
    } else {
      // 對話框關閉時，清空 fields 避免狀態殘留
      replace([]);
    }
  }, [isOpen, type, targetProduct, reset, replace]);

  // 監聽 imageUrl 變化
  useEffect(() => {
    if (watchImageUrl) {
      setImagePreview(watchImageUrl);
    }
  }, [watchImageUrl]);

  // ===== 事件處理函數 =====
  // 新增加購群組
  const handleAddAddonGroup = () => {
    append({
      group: '',
      options: [
        { name: '', price: 0 },
        { name: '', price: 0 },
      ],
    });
  };

  // 刪除加購群組
  const handleRemoveAddonGroup = (index: number) => {
    remove(index);
  };

  // 新增選項
  const handleAddOption = (groupIndex: number) => {
    const currentAddons = watch('addons');
    if (currentAddons && currentAddons[groupIndex]) {
      const updatedOptions = [
        ...currentAddons[groupIndex].options,
        { name: '', price: 0 },
      ];
      setValue(`addons.${groupIndex}.options`, updatedOptions);
    }
  };

  // 刪除選項
  const handleRemoveOption = (groupIndex: number, optionIndex: number) => {
    const currentAddons = watch('addons');
    if (currentAddons && currentAddons[groupIndex]) {
      const updatedOptions = currentAddons[groupIndex].options.filter(
        (_, idx) => idx !== optionIndex,
      );
      setValue(`addons.${groupIndex}.options`, updatedOptions);
    }
  };

  // 處理分類選擇
  const handleCategoryChange = (value: string) => {
    if (value === '__NEW_CATEGORY__') {
      setShowNewCategoryInput(true);
      setNewCategoryInput('');
      setValue('category', '', { shouldValidate: true });
    } else {
      setShowNewCategoryInput(false);
      setValue('category', value, { shouldValidate: true });
    }
  };

  // 處理取消新增分類
  const handleCancelNewCategory = () => {
    setShowNewCategoryInput(false);
    setNewCategoryInput('');
    setValue('category', '', { shouldValidate: true });
  };

  // 表單提交
  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    if (!data.category) {
      setResultInfo({
        isOpen: true,
        resultType: 'error',
        title: '驗證錯誤',
        message: '請選擇或輸入分類',
        btnText: '關閉',
      });
      return;
    }

    const productData: Omit<Product, '_id' | 'productId'> = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      isPopular: data.isPopular,
      addons: data.addons && data.addons.length > 0 ? data.addons : null,
    };

    if (type === 'new') {
      createProduct(productData, {
        onSuccess: () => {
          setResultInfo({
            isOpen: true,
            resultType: 'success',
            title: '新增成功',
            message: '商品已成功新增',
            btnText: '關閉',
          });
          onClose();
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
            btnText: '關閉',
          });
        },
      });
    } else if (type === 'edit' && targetProduct?.productId) {
      updateProduct(
        {
          productId: targetProduct.productId,
          productData,
        },
        {
          onSuccess: () => {
            setResultInfo({
              isOpen: true,
              resultType: 'success',
              title: '更新成功',
              message: '商品已成功更新',
              btnText: '關閉',
            });
            onClose();
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
              btnText: '關閉',
            });
          },
        },
      );
    }
  };

  // 關閉 ResultDialog
  const handleResultDialogClose = () => {
    setResultInfo((prev) => ({ ...prev, isOpen: false }));
  };

  // ===== 渲染 UI =====
  return (
    <>
      <Dialog
        open={isOpen}
        autoFocus
        disableRestoreFocus
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: 680,
            borderRadius: 1,
            p: 0,
          },
        }}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'new' ? '新增商品' : '編輯商品'}
            </h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-8 overflow-y-auto p-6">
            {/* 商品資訊 Section */}
            <section>
              <h2 className="pb-4 text-lg font-bold text-gray-900">商品資訊</h2>
              <div className="space-y-5">
                {/* 商品名稱 */}
                <label className="relative flex flex-col pb-4">
                  <p className="pb-2 text-base font-medium text-gray-900">
                    商品名稱<span className="text-error">*</span>
                  </p>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TextField
                          {...field}
                          placeholder="例如：麻醬麵"
                          fullWidth
                          size="small"
                          error={!!errors.name}
                          // helperText={errors.name?.message}
                        />
                        {errors.name && (
                          <span className="absolute -bottom-1 left-2 text-sm text-error">
                            {errors.name?.message}
                          </span>
                        )}
                      </>
                    )}
                  />
                </label>

                {/* 商品描述 */}
                <label className="flex flex-col">
                  <p className="pb-2 text-base font-medium text-gray-900">
                    商品描述
                  </p>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="輸入商品描述"
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                      />
                    )}
                  />
                </label>

                {/* 價格和分類 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 價格 */}
                  <label className="relative flex flex-col pb-4">
                    <p className="pb-2 text-base font-medium text-gray-900">
                      價格<span className="text-error">*</span>
                    </p>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <>
                          <TextField
                            {...field}
                            type="number"
                            placeholder="請輸入價格"
                            fullWidth
                            size="small"
                            error={!!errors.price}
                            // helperText={errors.price?.message}
                          />
                          {errors.price && (
                            <span className="absolute -bottom-1 left-2 text-sm text-error">
                              {errors.price?.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </label>

                  {/* 分類 */}
                  <label className="relative flex flex-col pb-4">
                    <p className="pb-2 text-base font-medium text-gray-900">
                      分類<span className="text-error">*</span>
                    </p>
                    {showNewCategoryInput ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <TextField
                            value={newCategoryInput}
                            onChange={(e) => {
                              setNewCategoryInput(e.target.value);
                              setValue('category', e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                            placeholder="輸入新分類"
                            fullWidth
                            size="small"
                            autoFocus
                            error={!!errors.category}
                            // helperText={errors.category?.message}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancelNewCategory}
                            sx={{ minWidth: '60px' }}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <>
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors.category}
                            >
                              <Select
                                {...field}
                                displayEmpty
                                onChange={(e) =>
                                  handleCategoryChange(e.target.value)
                                }
                              >
                                <MenuItem value="" disabled>
                                  選擇一個分類
                                </MenuItem>
                                {categories.map((category) => (
                                  <MenuItem key={category} value={category}>
                                    {category}
                                  </MenuItem>
                                ))}
                                <MenuItem value="__NEW_CATEGORY__">
                                  <span className="font-bold text-primary">
                                    新增分類...
                                  </span>
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </>
                        )}
                      />
                    )}
                    {errors.category && (
                      <span className="absolute -bottom-1 left-2 text-sm text-error">
                        {errors.category?.message}
                      </span>
                    )}
                  </label>
                </div>

                {/* 商品圖片 */}
                <div className="space-y-4">
                  <p className="text-base font-medium text-gray-900">
                    商品圖片
                  </p>
                  <div
                    {...getRootProps()}
                    className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                      isDragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {isUploadingImage ? (
                      <CircularProgress size={40} />
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="預覽"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <MdImage className="mx-auto text-4xl text-grey" />
                        <p className="mt-2 text-sm text-grey">拖曳或點擊上傳</p>
                      </div>
                    )}
                  </div>

                  {/* 圖片網址（唯讀） */}
                  <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="https://example.com/image.jpg"
                        fullWidth
                        size="small"
                        disabled
                        error={!!errors.imageUrl}
                        helperText={errors.imageUrl?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* 開關區域 */}
              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-200 pt-6 md:grid-cols-2">
                {/* 是否上架 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      是否上架<span className="text-error">*</span>
                    </p>
                    <p className="text-sm text-grey">商品將對顧客可見。</p>
                  </div>
                  <Controller
                    name="isAvailable"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    )}
                  />
                </div>

                {/* 是否為熱門商品 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">是否為熱門商品</p>
                    <p className="text-sm text-grey">
                      將此商品標記為熱門項目。
                    </p>
                  </div>
                  <Controller
                    name="isPopular"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* 加購選項 Section */}
            <section>
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-bold text-gray-900">加購選項</h2>
                <Button
                  type="button"
                  variant="text"
                  startIcon={
                    <HiOutlinePlusSm className="text-base text-secondary" />
                  }
                  onClick={handleAddAddonGroup}
                  sx={{
                    color: 'secondary.main',
                    bgcolor: 'secondary.light',
                    '&:hover': {
                      bgcolor: 'secondary.light',
                      opacity: 0.8,
                    },
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  新增群組
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, groupIndex) => (
                  <div
                    key={field.id}
                    className="rounded-lg border border-gray-300 bg-gray-50 p-4"
                  >
                    {/* 群組名稱 */}
                    <div className="mb-4 flex items-start gap-4">
                      <label className="flex-1">
                        <p className="pb-2 text-base font-medium text-gray-900">
                          群組名稱
                        </p>
                        <Controller
                          name={`addons.${groupIndex}.group`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              placeholder="例如：選擇您的醬料"
                              fullWidth
                              size="small"
                              error={!!errors.addons?.[groupIndex]?.group}
                              helperText={
                                errors.addons?.[groupIndex]?.group?.message
                              }
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'white',
                                },
                              }}
                            />
                          )}
                        />
                      </label>
                      <IconButton
                        onClick={() => handleRemoveAddonGroup(groupIndex)}
                      >
                        <FaRegTrashCan className="text-base text-error-light" />
                      </IconButton>
                    </div>

                    {/* 選項列表 */}
                    <div className="space-y-3 pl-2">
                      <p className="text-sm font-medium text-grey">選項</p>
                      {watch(`addons.${groupIndex}.options`)?.map(
                        (_, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3"
                          >
                            <Controller
                              name={`addons.${groupIndex}.options.${optionIndex}.name`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  placeholder="選項名稱"
                                  size="small"
                                  fullWidth
                                  error={
                                    !!errors.addons?.[groupIndex]?.options?.[
                                      optionIndex
                                    ]?.name
                                  }
                                  helperText={
                                    errors.addons?.[groupIndex]?.options?.[
                                      optionIndex
                                    ]?.name?.message
                                  }
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      bgcolor: 'white',
                                    },
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name={`addons.${groupIndex}.options.${optionIndex}.price`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  placeholder="0.00"
                                  size="small"
                                  label="加價$"
                                  error={
                                    !!errors.addons?.[groupIndex]?.options?.[
                                      optionIndex
                                    ]?.price
                                  }
                                  helperText={
                                    errors.addons?.[groupIndex]?.options?.[
                                      optionIndex
                                    ]?.price?.message
                                  }
                                  sx={{
                                    width: 200,
                                    '& .MuiOutlinedInput-root': {
                                      bgcolor: 'white',
                                    },
                                  }}
                                />
                              )}
                            />
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleRemoveOption(groupIndex, optionIndex)
                              }
                              disabled={
                                watch(`addons.${groupIndex}.options`)?.length <=
                                2
                              }
                            >
                              <HiOutlineX
                                className={`text-base ${
                                  watch(`addons.${groupIndex}.options`)
                                    ?.length <= 2
                                    ? 'text-grey'
                                    : 'text-error-light'
                                }`}
                              />
                            </IconButton>
                          </div>
                        ),
                      )}

                      <Button
                        type="button"
                        variant="text"
                        size="small"
                        startIcon={<HiOutlinePlusSm />}
                        onClick={() => handleAddOption(groupIndex)}
                        sx={{
                          color: 'secondary.main',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        新增選項
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-4 border-t p-6">
            <Button
              type="button"
              variant="text"
              onClick={onClose}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'grey.600',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              取消
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: 'primary.main',
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {isCreating || isUpdating ? (
                <CircularProgress size={24} color="inherit" />
              ) : type === 'new' ? (
                '儲存商品'
              ) : (
                '更新商品'
              )}
            </Button>
          </footer>
        </form>
      </Dialog>

      {/* Result Dialog */}
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

export default EditProductDialog;
