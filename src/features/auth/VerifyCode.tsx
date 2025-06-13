import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import useRedirectIfLoggedIn from '../../utils/useRedirectIfLoggedIn';
import { verifyCodeSchema } from './loginSchema';
import ConfirmDialog from './ConfirmDialog';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

interface FormValues {
  otp: string;
}

function VerifyCode() {
  const { account, isCheckingAuth, isLoading, setLoading } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  console.log('VerifyCode render', account);
  // 判斷是否已經登入
  useRedirectIfLoggedIn();

  // 如果 account 為空 (可能用戶重整)，則跳轉到忘記密碼頁面
  useEffect(() => {
    if (!localStorage.getItem('account')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [account]);

  // react-hooks-form 設定
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { otp: '' },
    resolver: yupResolver(verifyCodeSchema),
  });

  // 重新發送驗證碼
  const resendVerificationCode = async () => {
    const data = {
      account: account,
    };
    setErrorMsg('');
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
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resend-verification-code`,
        data,
      );
      setOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            setErrorMsg(err.response.data.message);
            break;
          default:
            setErrorMsg('發生錯誤，請稍後再試');
            break;
        }
      } else {
        setErrorMsg('發生錯誤，請稍後再試');
      }
    }
  };

  // 關閉再次送出燈箱
  const handleDialogClose = () => {
    setOpen(false);
  };

  // 表單 submit 事件
  const onSubmit = async (value: FormValues) => {
    setErrorMsg('');
    setLoading(true);
    const data = {
      code: value.otp,
      account: localStorage.getItem('account'),
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/verify-reset-code`,
        data,
      );
      navigate('/reset-password');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            setErrorMsg(err.response.data.message);
            break;
          default:
            setErrorMsg('發生錯誤，請稍後再試');
            break;
        }
      } else {
        setErrorMsg('發生錯誤，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  // 如果正在檢查認證狀態，顯示進度條
  if (isCheckingAuth) {
    return <LinearProgress color="primary" />;
  }
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
                onClick={resendVerificationCode}
              >
                重新發送驗證碼 {countdown > 0 ? `(${countdown}s)` : ''}
              </button>
            </div>

            <div className="relative mt-2">
              {errorMsg && (
                <p className="absolute -top-7 left-0 mb-2 ml-2 text-sm text-error">
                  {errorMsg}
                </p>
              )}
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
                className={isLoading ? 'pointer-event-none' : ''}
                disabled={isLoading}
              >
                {isLoading ? (
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
      <ConfirmDialog
        open={open}
        title="驗證碼已寄出"
        message="請查看您的電子郵件信箱，"
        buttonText="關閉"
        onClose={handleDialogClose}
      />
    </>
  );
}
export default VerifyCode;
