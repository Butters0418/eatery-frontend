import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import { loginSchema } from './loginSchema';
import { useLoginMutation } from '../../hooks/useUserOperations';
import useClearErrorMessage from '../../hooks/useClearAuthErrorMessage';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

// type
import { LoginInfo } from '../../types/userType';

function LoginPage() {
  const { errorMessage, role } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLoginMutation();

  // 清空錯誤訊息
  useClearErrorMessage();

  // 判斷是否已經登入
  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'staff') {
      navigate('/order-page');
    }
  }, [role, navigate]);

  // react-hooks-form 設定
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({
    defaultValues: {
      account: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  // 表單 submit 事件
  const onSubmit = (data: LoginInfo) => {
    login(data, {
      onSuccess: () => {
        const currentRole = useAuthStore.getState().role;
        if (currentRole === 'admin') {
          navigate('/admin');
        } else if (currentRole === 'staff') {
          navigate('/order-page');
        }
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grey-light p-4 md:p-8">
      {/* card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-custom">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Eatery</h1>
          <p className="text-neutral mt-2">餐飲管理系統</p>
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
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: '請輸入密碼' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="密碼"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                size="small"
                color="primary"
                autoComplete="current-password"
              />
            )}
          />
          <div className="flex justify-end">
            <NavLink
              to="/forgot-password"
              className="text-sm text-grey hover:text-grey-dark"
            >
              忘記密碼
            </NavLink>
          </div>
          <div className="relative">
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
                <p className="text-lg">登入</p>
              )}
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-8 text-center text-sm text-grey">
        &copy; 2025 Eatery 餐飲管理系統. 保留所有權利.
      </div>
    </div>
  );
}
export default LoginPage;
