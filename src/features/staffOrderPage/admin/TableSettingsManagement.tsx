// React
import { useMemo, useState } from 'react';

// MUI
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Components
import TableInfoDialog from '../components/TableInfoDialog';

// Hooks
import {
  useCreateTable,
  useDeleteTable,
  useTableQuery,
} from '../../../hooks/useTableOperations';

// Stores
import useTableStore from '../../../stores/useTableStore';

// Types
import { Table } from '../../../types/tableType';

// Icons
import { iconTable } from '../../../assets';
import { RxReader, RxPlus, RxCross2 } from 'react-icons/rx';

function TableSettingsManagement() {
  const tables = useTableStore((state) => state.tables);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { mutate: createTable, isPending: isCreatingTable } = useCreateTable();
  const { mutate: removeTable, isPending: isDeletingTable } = useDeleteTable();
  useTableQuery();

  const nextTableNumber = useMemo(() => {
    if (!tables || tables.length === 0) {
      return 1;
    }
    return (
      tables.reduce((max, table) => {
        return table.tableNumber > max ? table.tableNumber : max;
      }, 0) + 1
    );
  }, [tables]);

  const lastTableNumber = useMemo(() => {
    if (!tables || tables.length === 0) {
      return null;
    }
    return tables.reduce((max, table) => {
      return table.tableNumber > max ? table.tableNumber : max;
    }, 0);
  }, [tables]);

  const handleCreateTable = () => {
    if (isCreatingTable) {
      return;
    }
    createTable(nextTableNumber);
  };

  const handleDeleteTable = (table: Table) => {
    if (isDeletingTable) {
      return;
    }
    if (selectedTable?._id === table._id) {
      setIsDialogOpen(false);
    }
    removeTable(table._id);
  };

  const handleOpenDialog = (table: Table) => {
    setSelectedTable(table);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDialogExited = () => {
    setSelectedTable(null);
  };

  return (
    <div className="space-y-4 2xl:space-y-6">
      <div className="flex flex-col space-y-2 2xl:space-y-2">
        <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
          桌面管理
        </h1>
        <Alert severity="warning">
          <AlertTitle>注意事項</AlertTitle>因 1-5
          桌為固定桌號，故無法刪除。新增/刪除桌號將從 6 桌開始。
        </Alert>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-custom 2xl:p-4">
        <ul className="grid w-full max-w-[1100px] grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-4">
          {tables?.map((table) => {
            const isLastTable =
              lastTableNumber !== null &&
              table.tableNumber === lastTableNumber &&
              table.tableNumber >= 6;
            return (
              <li
                key={table._id}
                className="relative overflow-hidden rounded-lg border"
              >
                {isLastTable && (
                  <button
                    type="button"
                    className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 text-grey transition hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => handleDeleteTable(table)}
                    disabled={isDeletingTable}
                  >
                    <RxCross2 className="text-lg" />
                  </button>
                )}
                <div className="border-b p-1 xl:p-2">
                  <h3 className="font-bold text-grey 2xl:text-lg">
                    {table.tableNumber} 桌
                  </h3>
                </div>
                <div className="pointer-events-none -mt-[16%] p-[5%]">
                  <img className="w-full" src={iconTable} alt="table" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-lg"
                  onClick={() => handleOpenDialog(table)}
                >
                  <RxReader className="text-2xl text-secondary" />
                </button>
              </li>
            );
          })}
          <li className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed border-grey-light bg-grey-light/30 text-grey">
            <button
              type="button"
              className="flex flex-col items-center gap-2 rounded-lg p-4 text-grey transition hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleCreateTable}
              disabled={isCreatingTable}
            >
              <RxPlus className="text-4xl" />
              <span className="text-base font-semibold">新增桌號</span>
            </button>
          </li>
        </ul>
      </div>
      <TableInfoDialog
        open={isDialogOpen}
        table={selectedTable}
        onClose={handleCloseDialog}
        onExited={handleDialogExited}
      />
    </div>
  );
}
export default TableSettingsManagement;
