import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import useRedirectIfLoggedIn from '../../utils/useRedirectIfLoggedIn';
import { forgotPasswordSchema } from './loginSchema';
import ConfirmDialog from './ConfirmDialog';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

interface FormValues {
  account: string;
}

function ForgotPassword() {
  const { isLoading, isCheckingAuth, setAuth, setLoading } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // 判斷是否已經登入
  useRedirectIfLoggedIn();

  // react-hooks-form 設定
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      account: '',
    },
    resolver: yupResolver(forgotPasswordSchema),
  });

  // 表單 submit 事件
  const onSubmit = async (data: FormValues) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resend-verification-code`,
        data,
      );
      const account = data.account;
      setAuth(account, null, '', false);
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
    } finally {
      setLoading(false);
    }
  };

  // dialog 關閉導至 Verify 頁
  const handleDialogClose = () => {
    console.log('導航到驗證頁面');
    setOpen(false);
    navigate('/verify-code', { replace: true });
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
            <p className="text-neutral mt-2">忘記密碼</p>
          </div>
          <form className="mt-6 grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="account"
              control={control}
              rules={{ required: '請輸入帳號' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="帳號"
                  error={!!errors.account}
                  helperText={errors.account?.message}
                  fullWidth
                  size="small"
                  color="primary"
                  autoComplete="account"
                  placeholder="butters.test.demo@gmail.com"
                />
              )}
            />

            <div className="relative mt-6">
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
                  <p className="text-lg">發送驗證碼</p>
                )}
              </Button>
            </div>
            <div className="flex justify-center">
              <NavLink
                to="/login"
                className="text-center text-sm text-primary hover:text-primary-dark"
              >
                返回登入頁面
              </NavLink>
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
        buttonText="前往驗證"
        onClose={handleDialogClose}
      />
    </>
  );
}
export default ForgotPassword;
