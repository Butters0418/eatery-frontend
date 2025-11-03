// 第三方庫
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

// Icons
import { FaCheckCircle } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

// ===== 類型定義 =====
type ResultType = 'success' | 'error' | 'info';

export interface ResultDialogProps {
  isOpen: boolean;
  resultType: ResultType;
  title: string;
  message: string;
  onClose: () => void;
  btnText?: string;
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

function ResultDialog({
  isOpen,
  resultType,
  title,
  message,
  btnText = '關 閉',
  onClose,
}: ResultDialogProps) {
  const { Icon, className } = getIconConfig(resultType);

  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth onClose={onClose}>
      <div className="p-8 text-center">
        <Icon className={`mx-auto text-[100px] ${className}`} />
        <h3 className="mt-2 text-lg font-medium text-grey-dark">{title}</h3>
        <p className="mb-7 mt-1 text-grey">{message}</p>
        <Button variant="contained" color="primary" fullWidth onClick={onClose}>
          <p className="text-lg">{btnText}</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default ResultDialog;
