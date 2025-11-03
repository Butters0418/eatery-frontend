// React
import { useState, useRef, useEffect } from 'react';

// 第三方庫
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

// Hooks
import {
  useResendVerificationCodeMutation,
  useVerifyCodeMutation,
} from '../../hooks/useUserOperations';
import useClearErrorMessage from '../../hooks/useAuthError';

// Stores
import useAuthStore from '../../stores/useAuthStore';

// Components
import ResultDialog from '../../components/ResultDialog';

// Schemas
import { verifyCodeSchema } from './loginSchema';

// ===== 類型定義 =====
interface FormValues {
  otp: string;
}

// ===== 主要元件 =====
function VerifyCode() {
  // ===== Hooks =====
  const { account, role, errorMessage } = useAuthStore();
  const { mutate: verifyCode, isPending } = useVerifyCodeMutation();
  const { mutate: resendVerificationCode } =
    useResendVerificationCodeMutation();
  const navigate = useNavigate();

  // ===== State & Refs =====
  const [countdown, setCountdown] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ===== 清空錯誤訊息 =====
  useClearErrorMessage();

  // ===== React Hook Form 設定 =====
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { otp: '' },
    resolver: yupResolver(verifyCodeSchema),
  });

  // ===== Effects =====
  // 判斷是否已經登入
  useEffect(() => {
    if (role === 'admin') {
      navigate('/order-page');
    } else if (role === 'staff') {
      navigate('/order-page');
    } else if (!account) {
      navigate('/forgot-password', { replace: true });
    }
  }, [role, account, navigate]);

  // ===== 事件處理函數 =====
  // 重新發送驗證碼
  const resentCodeHandler = async () => {
    // 重置倒數
    setCountdown(10);

    // 清除舊的 timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // 啟動新倒數
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 重新發送驗證碼
    resendVerificationCode(account!, {
      onSuccess: () => {
        setOpen(true);
      },
    });
  };

  // 關閉再次送出燈箱
  const handleDialogClose = () => {
    setOpen(false);
  };

  // 表單 submit 事件
  const onSubmit = async (data: FormValues) => {
    verifyCode(
      { code: data.otp, account: account! },
      {
        onSuccess: () => {
          navigate('/reset-password', { replace: true });
        },
      },
    );
  };

  // ===== Render =====
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-grey-light p-4 md:p-8">
        {/* card */}
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-custom">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Eatery</h1>
            <p className="text-neutral mt-2">輸入驗證碼</p>
          </div>

          <form className="mt-6 grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <div className="">
                  <TextField
                    {...field}
                    label="驗證碼"
                    fullWidth
                    inputMode="numeric"
                    onChange={(e) => {
                      const input = e.target as HTMLInputElement;
                      field.onChange(input.value.replace(/[^0-9]/g, '')); // 僅允許數字
                    }}
                    size="small"
                    color="primary"
                    autoComplete="otp"
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                  />
                </div>
              )}
            />
            <div className="text-center">
              <p className="text-grey">沒有收到驗證碼？</p>
              <button
                disabled={countdown > 0}
                aria-label="重新發送驗證碼"
                type="button"
                className={`text-sm font-medium text-primary transition-all hover:text-primary-dark ${countdown > 0 && 'pointer-events-none text-primary-light'}`}
                onClick={resentCodeHandler}
              >
                重新發送驗證碼 {countdown > 0 ? `(${countdown}s)` : ''}
              </button>
            </div>

            <div className="relative mt-2">
              {errorMessage && (
                <p className="absolute -top-7 left-0 mb-2 ml-2 text-sm text-error">
                  {errorMessage}
                </p>
              )}
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                className={isPending ? 'pointer-event-none' : ''}
                disabled={isPending}
              >
                {isPending ? (
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress size="28px" color="inherit" />
                  </Box>
                ) : (
                  <p className="text-lg">送出</p>
                )}
              </Button>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center text-sm text-grey">
          &copy; 2025 Eatery 餐飲管理系統. 保留所有權利.
        </div>
      </div>

      {/* Result Dialog */}
      <ResultDialog
        isOpen={open}
        resultType="success"
        title="驗證碼已寄出"
        message="請查看您的電子郵件信箱"
        btnText="關閉"
        onClose={handleDialogClose}
      />
    </>
  );
}
export default VerifyCode;
