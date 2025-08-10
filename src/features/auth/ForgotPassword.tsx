import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import { forgotPasswordSchema } from './loginSchema';
import ConfirmDialog from './ConfirmDialog';
import { useResendVerificationCodeMutation } from '../../hooks/useUserOperations';
import useClearErrorMessage from '../../hooks/useClearAuthErrorMessage';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

interface FormValues {
  account: string;
}

function ForgotPassword() {
  const { mutate: resendVerificationCode, isPending } =
    useResendVerificationCodeMutation();
  const { role, errorMessage } = useAuthStore();
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // 清空錯誤訊息
  useClearErrorMessage();

  // 判斷是否已經登入
  if (role === 'admin') {
    navigate('/admin');
  } else if (role === 'staff') {
    navigate('/internal-dashboard');
  }

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
    resendVerificationCode(data.account, {
      onSuccess: () => {
        setOpen(true);
      },
    });
  };

  // dialog 關閉導至 Verify 頁
  const handleDialogClose = () => {
    setOpen(false);
    navigate('/verify-code', { replace: true });
  };

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
