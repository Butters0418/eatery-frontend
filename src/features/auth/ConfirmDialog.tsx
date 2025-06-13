// Auth 共用燈箱
import { FaCheckCircle } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  buttonText,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={(_e, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
    >
      <div className="p-8 text-center">
        <FaCheckCircle className="mx-auto text-[100px] text-secondary" />
        <h3 className="mt-2 text-lg font-medium text-grey-dark">{title}</h3>
        <p className="mb-7 mt-1 text-grey">{message}</p>

        <Button onClick={onClose} variant="contained" color="primary" fullWidth>
          <p className="text-lg">{buttonText}</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default ConfirmDialog;
