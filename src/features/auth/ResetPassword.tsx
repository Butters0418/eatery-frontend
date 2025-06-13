import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import useRedirectIfLoggedIn from '../../utils/useRedirectIfLoggedIn';
import { resetPasswordSchema } from './loginSchema';
import ConfirmDialog from './ConfirmDialog';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

interface FormValues {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const { isLoading, account, isCheckingAuth, setLoading } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (value: FormValues) => {
    setErrorMsg('');
    setLoading(true);
    const data = {
      account: localStorage.getItem('account'),
      newPassword: value.confirmPassword,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password`,
        data,
      );
      setOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 400:
            setErrorMsg(err.response.data.message);
            break;
          case 403:
            setErrorMsg(err.response.data.message);
            break;
          case 404:
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

  // dialog 關閉導至 login 頁
  const handleDialogClose = () => {
    setOpen(false);
    navigate('/login', { replace: true });
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
            <p className="text-neutral mt-2">重設密碼</p>
          </div>

          <form className="mt-6 grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              autoComplete="username"
              value={account ?? ''}
              style={{ display: 'none' }}
              aria-hidden="true"
              readOnly
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: '請輸入密碼' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="新密碼"
                  type="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  size="small"
                  color="primary"
                  autoComplete="new-password"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: '請再次輸入密碼',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="確認密碼"
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                  size="small"
                  color="primary"
                  autoComplete="new-password"
                />
              )}
            />

            <div className="relative mt-8">
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
                  <p className="text-lg">重設密碼</p>
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
        title="密碼重設成功"
        message="請使用新密碼重新登入"
        buttonText="登入"
        onClose={handleDialogClose}
      />
    </>
  );
}
export default ResetPassword;
