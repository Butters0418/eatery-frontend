import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';

// 自定義 hooks/stores
import useAuthStore from '../../stores/useAuthStore';
import useRedirectIfLoggedIn from '../../utils/useRedirectIfLoggedIn';
import { loginSchema } from './loginSchema';

// Material UI 元件
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';

interface FormValues {
  account: string;
  password: string;
}

function LoginPage() {
  const { isLoading, isCheckingAuth, setLoading, setAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
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
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });

  // 表單 submit 事件
  const onSubmit = async (data: FormValues) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
      );
      const {
        token,
        user: { account, role },
      } = res.data;
      // 設定認證狀態
      setAuth(account, role, token, true);
      // 根據角色導向不同頁面
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/internal-dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 401:
            setErrorMsg(err.response.data.message);
            break;
          case 403:
            setErrorMsg(err.response.data.message);
            break;
          default:
            setErrorMsg('登入失敗，請稍後再試');
            break;
        }
      } else {
        setErrorMsg('登入失敗，請稍後再試');
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
