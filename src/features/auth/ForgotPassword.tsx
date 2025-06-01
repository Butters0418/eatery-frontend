import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from './loginSchema';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

interface FormValues {
  account: string;
}

function ForgotPassword() {
  const { setAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resend-verification-code`,
        data,
      );
      const account = data.account;
      setIsLoading(false);
      setAuth(account, null, '', true);
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
      setIsLoading(false);
    }
  };

  // dialog 關閉導至 Verify 頁
  const handleDialogClose = () => {
    setOpen(false);
    navigate('/verify-code');
  };

  return (
    <>
      <div className="flex h-full border">
        <div className="m-auto w-96 rounded-md border border-gray-300 p-6">
          <h1 className="text-xl font-bold tracking-wide text-zinc-800">
            寄送驗証碼
          </h1>
          <p className="mt-1 tracking-wide text-zinc-500">
            僅限解鎖管理員帳號
            <br />
            員工帳號解鎖請洽【管理員】
          </p>
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
                  placeholder="text@gmail.com"
                />
              )}
            />

            <div>
              {errorMsg && (
                <p className="mb-2 text-sm text-red-500">{errorMsg}</p>
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
                    <CircularProgress size="25px" color="inherit" />
                  </Box>
                ) : (
                  '取得驗証碼'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleDialogClose();
          }
        }}
      >
        <DialogTitle>系統通知</DialogTitle>
        <DialogContent>驗証碼已寄出</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default ForgotPassword;
