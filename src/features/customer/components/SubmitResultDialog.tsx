// 第三方庫
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

// Icons
import { FaCheckCircle } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';

// ===== 類型定義 =====
interface SubmitResultDialogProps {
  isSubmitResultOpen: boolean;
  submitResult: {
    success: boolean;
    title: string;
    message: string;
  } | null;
  setIsSubmitResultOpen: (open: boolean) => void;
}

// 訂單提交結果對話框
function SubmitResultDialog({
  isSubmitResultOpen,
  submitResult,
  setIsSubmitResultOpen,
}: SubmitResultDialogProps) {
  // ===== 渲染 UI =====
  return (
    <Dialog
      open={isSubmitResultOpen}
      maxWidth="xs"
      fullWidth
      onClose={() => setIsSubmitResultOpen(false)}
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
          onClick={() => setIsSubmitResultOpen(false)}
        >
          <p className="text-lg">關 閉</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default SubmitResultDialog;
