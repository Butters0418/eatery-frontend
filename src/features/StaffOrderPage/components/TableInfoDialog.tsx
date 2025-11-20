import { useCallback, useMemo, useRef } from 'react';

// 第三方庫
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import QRCode from 'react-qr-code';

// Icons
import { RxCross2 } from 'react-icons/rx';

// Types
import { Table } from '../../../types/tableType';

interface TableInfoDialogProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onExited?: () => void;
}

function TableInfoDialog({
  open,
  table,
  onClose,
  onExited,
}: TableInfoDialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const tableUrl = useMemo(() => {
    if (!table) {
      return '';
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (!origin) {
      return `/?tableNumber=${table.tableNumber}`;
    }
    return `${origin}/?tableNumber=${table.tableNumber}`;
  }, [table]);

  const handleDownload = useCallback(() => {
    if (
      !containerRef.current ||
      !table ||
      !tableUrl ||
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) {
      return;
    }
    const serialized = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([serialized], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    const size = 1024;
    const padding = Math.floor(size * 0.08); // keep white padding around QR

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(
        image,
        padding,
        padding,
        size - padding * 2,
        size - padding * 2,
      );
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return;
          }
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `table-${table.tableNumber}-qrcode.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },
        'image/jpeg',
        1,
      );
    };
    image.src = url;
  }, [table, tableUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onExited,
      }}
    >
      <div className="relative p-6 2xl:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-grey-light p-2 text-grey-dark transition hover:bg-grey-light/70"
        >
          <RxCross2 className="text-xl" />
        </button>
        <h3 className="text-xl font-bold text-grey-dark 2xl:text-2xl">
          {table?.tableNumber} 桌
        </h3>
        {table ? (
          <div className="mt-6 space-y-5">
            <div className="space-y-1">
              <p className="text-sm text-grey">點餐網址</p>
              <a
                href={tableUrl}
                target="_blank"
                rel="noreferrer"
                className="block break-all rounded-lg border bg-grey-light/40 px-3 py-2 text-sm text-primary underline-offset-2 hover:underline"
              >
                {tableUrl}
              </a>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div
                className="rounded-lg border bg-white p-4"
                ref={containerRef}
              >
                <QRCode value={tableUrl || ''} size={240} />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                disabled={!tableUrl}
              >
                下載 QRCode
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-center text-grey">請選擇桌位以查看資訊</p>
        )}
      </div>
    </Dialog>
  );
}
export default TableInfoDialog;
