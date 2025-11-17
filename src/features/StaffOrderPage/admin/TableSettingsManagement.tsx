// Hooks
import { useTableQuery } from '../../../hooks/useTableOperations';

// Stores
import useTableStore from '../../../stores/useTableStore';

// Icons
import { iconTable } from '../../../assets';
import { RxReader } from 'react-icons/rx';
function TableSettingsManagement() {
  const tables = useTableStore((state) => state.tables);
  useTableQuery();

  return (
    <div className="space-y-4 2xl:space-y-6">
      <div className="flex flex-col space-y-2 2xl:space-y-2">
        <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
          桌面管理
        </h1>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-custom 2xl:p-4">
        <ul className="grid w-full max-w-[1100px] grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-4">
          {tables?.map((table) => {
            return (
              <li
                key={table._id}
                className="relative overflow-hidden rounded-lg border"
              >
                <div className="border-b p-1 xl:p-2">
                  <h3 className="font-bold text-grey 2xl:text-lg">
                    {table.tableNumber} 桌
                  </h3>
                </div>
                <div className="pointer-events-none -mt-[16%] p-[5%]">
                  <img className="w-full" src={iconTable} alt="table" />
                </div>
                <button className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-lg">
                  <RxReader className="text-xl text-secondary" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default TableSettingsManagement;
