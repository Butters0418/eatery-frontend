import { MdErrorOutline } from 'react-icons/md';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

interface ErrorDialogProps {
  open: boolean;
  errorMsg: string;
  onClose: () => void;
}

function ErrorDialog({ open, errorMsg, onClose }: ErrorDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <div className="p-8 text-center">
        <h3 className="mt-2 flex items-center justify-center text-xl font-medium text-grey-dark">
          <MdErrorOutline className="mr-1 text-error" />
          <p className="text-grey">錯誤</p>
        </h3>
        <p className="mb-6 mt-2 text-grey">{errorMsg}</p>

        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          <p className="text-lg">關閉</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default ErrorDialog;
