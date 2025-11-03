// 第三方庫
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import { FaCheckCircle } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

// Type

// ===== 類型定義 =====
type ResultType = 'success' | 'error' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  resultType: ResultType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  btnText: string;
  isPending: boolean;
}

// Icon & 樣式
const getIconConfig = (type: ResultType) => {
  const configs = {
    success: {
      Icon: FaCheckCircle,
      className: 'text-secondary',
    },
    error: {
      Icon: MdErrorOutline,
      className: 'text-error',
    },
    info: {
      Icon: AiOutlineQuestionCircle,
      className: 'text-secondary',
    },
  };

  return configs[type];
};

function ConfirmDialog({
  isOpen,
  resultType,
  title,
  message,
  onClose,
  onConfirm,
  btnText,
  isPending,
}: ConfirmDialogProps) {
  const { Icon, className } = getIconConfig(resultType);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth onClose={onClose}>
      <div className="p-8 text-center">
        <Icon className={`mx-auto text-[100px] ${className}`} />
        <h3 className="mt-2 text-lg font-medium text-grey-dark">{title}</h3>
        <p className="mb-7 mt-1 text-grey">{message}</p>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: 2 }}
          disabled={isPending}
        >
          {isPending ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress size="28px" color="inherit" />
            </Box>
          ) : (
            <p className="text-lg">{btnText}</p>
          )}
        </Button>
      </div>
    </Dialog>
  );
}
export default ConfirmDialog;
