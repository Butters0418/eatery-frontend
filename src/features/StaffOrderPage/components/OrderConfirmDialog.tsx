import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface OrderConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
  onConfirm?: () => void;
  isPending?: boolean;
}

function OrderConfirmDialog({
  open,
  title,
  message,
  buttonText,
  onConfirm,
  isPending = false,
  onClose,
}: OrderConfirmDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <div className="p-8 text-center">
        <h3 className="mt-2 flex items-center justify-center text-xl font-medium text-grey-dark">
          <AiOutlineQuestionCircle className="mr-1 text-secondary" />
          <p>{title}</p>
        </h3>
        <p className="mb-6 mt-2 text-grey">{message}</p>

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
            <p className="text-lg">{buttonText}</p>
          )}
        </Button>
      </div>
    </Dialog>
  );
}
export default OrderConfirmDialog;
