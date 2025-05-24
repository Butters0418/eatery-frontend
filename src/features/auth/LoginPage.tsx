import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { loginSchema } from './loginSchema';
import axios from 'axios';

interface FormValues {
  account: string;
  password: string;
}

function LoginPage() {
  const { hasCheckedAuth, token, role, setAuth, setLogout } = useAuthStore();
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
    }
  };

  return (
    <div className="flex h-full border">
      <div className="m-auto w-96 rounded-md border border-gray-600 p-6">
        <h1 className="text-xl font-bold">登入</h1>
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
          <Button variant="contained" type="submit" color="primary">
            登入
          </Button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
