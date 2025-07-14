import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { formatNumber } from '../../../utils/formatNumber';
interface CheckOrdersDialogProps {
  orderOpen: boolean;
  setOrderOpen: (open: boolean) => void;
}
function CheckOrdersDialog({
  orderOpen,
  setOrderOpen,
}: CheckOrdersDialogProps) {
  return (
    <Dialog
      open={orderOpen}
      autoFocus
      disableRestoreFocus
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: { xs: 500 },
          p: 0,
          m: 0,
        },
        '& .MuiPaper-root': {
          width: { xs: '95%', md: '100%' },
        },
      }}
      fullWidth
      onClose={() => setOrderOpen(false)}
    >
      <div className="p-3 md:p-8">
        <h3 className="border-b border-gray-200 pb-3 pl-1.5 text-center text-xl font-bold text-gray-900">
          訂單明細
          <span className="ml-2 text-[0.8em] font-normal text-grey">(5桌)</span>
        </h3>
        {/* 訂單 lists */}
        <div className="mt-3 rounded-xl bg-grey-light p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-bold text-grey-dark">訂單 #222821</h4>
            <span className="text-sm text-grey">2025年6月17日 下午05:07</span>
          </div>
          <ul className="mb-3 space-y-2">
            <li className="flex justify-between text-sm">
              <div>
                <span className="text-grey-dark">炒青菜</span>
                <span className="text-grey"> x 1</span>
              </div>
              <span className="text-grey-dark">$45</span>
            </li>
            <li className="flex justify-between text-sm">
              <div>
                <span className="text-grey-dark">炒青菜</span>
                <span className="text-grey"> x 1</span>
              </div>
              <span className="text-grey-dark">$45</span>
            </li>
            <li className="flex justify-between text-sm">
              <div>
                <span className="text-grey-dark">香酥雞排</span>
                <span className="text-grey"> x 2</span>

                <p className="text-xs text-grey">辣度: 不辣</p>
              </div>
              <span className="text-grey-dark">$45</span>
            </li>
          </ul>

          <div className="flex justify-between border-t border-dashed pt-3 font-bold">
            <span>小計 :</span>
            <span>
              <small>$</small>
              {formatNumber(135)}
            </span>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-grey-light p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-bold text-grey-dark">訂單 #222821</h4>
            <span className="text-sm text-grey">2025年6月17日 下午05:07</span>
          </div>
          <ul className="mb-3 space-y-2">
            <li className="flex justify-between text-sm">
              <div>
                <span className="text-grey-dark">炒青菜</span>
                <span className="text-grey"> x 1</span>
              </div>
              <span className="text-grey-dark">$45</span>
            </li>
            <li className="flex justify-between text-sm">
              <div>
                <span className="text-grey-dark">香酥雞排</span>
                <span className="text-grey"> x 2</span>

                <p className="text-xs text-grey">辣度: 不辣</p>
              </div>
              <span className="text-grey-dark">$45</span>
            </li>
          </ul>

          <div className="flex justify-between border-t border-dashed pt-3 font-bold">
            <span>小計 :</span>
            <span>
              <small>$</small>
              {formatNumber(135)}
            </span>
          </div>
        </div>
        <h3 className="my-3 flex justify-between border-t border-gray-200 px-3 pt-3 text-lg font-bold md:text-xl">
          <span>總金額 :</span>
          <span className="">
            <small>$</small>
            {formatNumber(1223)}
          </span>
        </h3>
        <p className="my-4 text-center text-gray-400">
          ※用餐完畢後請至櫃臺結帳，謝謝 !
        </p>
        <Button
          onClick={() => setOrderOpen(false)}
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          <p className="text-lg">關 閉</p>
        </Button>
      </div>
    </Dialog>
  );
}
export default CheckOrdersDialog;
