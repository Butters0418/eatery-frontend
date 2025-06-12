import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { loginSchema } from './loginSchema';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface FormValues {
  account: string;
  password: string;
}

function LoginPage() {
  const {
    hasCheckedAuth,
    token,
    role,
    isLoading,
    setLoading,
    setAuth,
    setLogout,
  } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  // 判斷是否已經登入
  useEffect(() => {
    const tokenInStorage = localStorage.getItem('token');
    // 有 token 但未驗證
    if (!hasCheckedAuth && tokenInStorage) {
      const checkAuth = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/me`,
            {
              headers: {
                Authorization: `Bearer ${tokenInStorage}`,
              },
            },
          );
          const { account, role } = res.data;
          setAuth(account, role, tokenInStorage, true);

          if (role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (role === 'staff') {
            navigate('/internal-dashboard', { replace: true });
          }
        } catch (err) {
          console.log(err);
          setLogout();
        }
      };
      checkAuth();
    }

    // 有 token 寫入 store 且已驗證
    if (hasCheckedAuth && token && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'staff') {
        navigate('/internal-dashboard', { replace: true });
      }
    }
  }, [hasCheckedAuth, role, token, navigate, setAuth, setLogout]);

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

      setAuth(account, role, token, true);

      console.log('登入成功');

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/internal-dashboard');
      }
    } catch (err) {
      console.log(err);
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

  return (
    <div className="bg-grey-light flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {/* card */}
      <div className="shadow-custom w-full max-w-md rounded-2xl bg-white p-8">
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
              className="text-grey hover:text-grey-dark text-sm"
            >
              忘記密碼
            </NavLink>
          </div>
          <div>
            {errorMsg && (
              <p className="text-error mb-2 ml-2 text-sm">{errorMsg}</p>
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
      <div className="text-grey mt-8 text-center text-sm">
        &copy; 2025 Eatery 餐飲管理系統. 保留所有權利.
      </div>
    </div>
  );
}
export default LoginPage;
