import { FaCheckCircle } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

interface SubmitResultDialogProps {
  open: boolean;
  submitResult: {
    success: boolean;
    title: string;
    message: string;
  } | null;
  setSubmitResultOpen: (open: boolean) => void;
}

function SubmitResultDialog({
  open,
  submitResult,
  setSubmitResultOpen,
}: SubmitResultDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={() => setSubmitResultOpen(false)}
    >
      <div className="p-8 text-center">
        {submitResult?.success ? (
          <FaCheckCircle className="mx-auto text-[100px] text-secondary" />
        ) : (
          <MdErrorOutline className="mx-auto text-[100px] text-error" />
        )}

        <h3 className="mt-2 text-lg font-medium text-grey-dark">
          {submitResult?.title}
        </h3>
        <p className="mb-7 mt-1 text-grey">{submitResult?.message}</p>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setSubmitResultOpen(false)}
        >
          <p className="text-lg">關 閉</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default SubmitResultDialog;
