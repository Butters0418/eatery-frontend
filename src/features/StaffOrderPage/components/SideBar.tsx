import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import { PiBowlFoodFill } from 'react-icons/pi';
import {
  MdRestaurantMenu,
  MdTableBar,
  MdPeople,
  MdRoomService,
} from 'react-icons/md';
import useAuthStore from '../../../stores/useAuthStore';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuthStore();

  // 根據當前路徑判斷選中狀態
  const getActiveIndex = () => {
    const path = location.pathname;
    if (path === '/order-page' || path === '/order-page/') return 0; // 訂單管理 (index route)
    if (path.includes('/order-creation')) return 1;
    if (path.includes('/tables-status')) return 2;
    if (path.includes('/admin/menu')) return 3;
    if (path.includes('/admin/table-settings')) return 4;
    if (path.includes('/admin/accounts')) return 5;
    return 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(getActiveIndex());

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    // 如果是絕對路徑則直接導航，否則使用相對路徑
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      navigate(path);
    }
  };

  // 基本選單項目
  const basicMenuItems = [
    {
      icon: FaClipboardList,
      label: '訂單管理',
      path: '/order-page', // 使用絕對路徑回到 index route
      index: 0,
    },
    {
      icon: MdRoomService,
      label: '開始點餐',
      path: 'order-creation',
      index: 1,
    },
    {
      icon: PiBowlFoodFill,
      label: '內用桌況',
      path: 'tables-status',
      index: 2,
    },
  ];

  // Admin 專用選單項目
  const adminMenuItems = [
    {
      icon: MdRestaurantMenu,
      label: '菜單管理',
      path: 'admin/menu',
      index: 3,
    },
    {
      icon: MdTableBar,
      label: '桌位設定',
      path: 'admin/table-settings',
      index: 4,
    },
    {
      icon: MdPeople,
      label: '帳號管理',
      path: 'admin/accounts',
      index: 5,
    },
  ];

  // 監聽路由變化
  useEffect(() => {
    setSelectedIndex(getActiveIndex());
  }, [location.pathname]);

  return (
    <aside className="w-52 border-r border-gray-200 bg-white shadow-custom 2xl:w-72">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto 2xl:top-20 2xl:h-[calc(100vh-5rem)]">
        <nav className="p-4 2xl:p-6">
          {/* header */}
          <div className="mb-6 2xl:mb-8">
            <h2 className="mb-2 text-lg font-semibold text-grey-dark 2xl:text-xl">
              功能選單
            </h2>
            <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary-light to-primary" />
          </div>

          {/* menu */}
          <ul className="space-y-2">
            {/* 基本功能選單 */}
            {basicMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = selectedIndex === item.index;

              return (
                <li key={item.index}>
                  <button
                    onClick={() => handleListItemClick(item.index, item.path)}
                    className={`flex min-h-[44px] w-full touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3 text-left 2xl:min-h-[48px] 2xl:py-4 ${
                      isActive
                        ? 'border-primary-light bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary-dark shadow-custom'
                        : 'border-opacity-0 text-grey-dark hover:bg-grey-light hover:text-grey-dark'
                    } `}
                  >
                    <div
                      className={`flex-shrink-0 rounded-xl p-2 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-light to-primary text-white'
                          : 'bg-grey-light text-grey'
                      } `}
                    >
                      <IconComponent className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    </div>
                    <span className="text-sm font-medium 2xl:text-base">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                </li>
              );
            })}

            {/* Admin 功能選單 */}
            {role === 'admin' && (
              <>
                {/* 分隔線 */}
                <li className="py-2">
                  <div className="border-t border-gray-200" />
                  <p className="mt-3 text-xs font-medium text-grey">管理功能</p>
                </li>

                {adminMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = selectedIndex === item.index;

                  return (
                    <li key={item.index}>
                      <button
                        onClick={() =>
                          handleListItemClick(item.index, item.path)
                        }
                        className={`flex min-h-[44px] w-full touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3 text-left 2xl:min-h-[48px] 2xl:py-4 ${
                          isActive
                            ? 'border-primary-light bg-gradient-to-r from-primary/10 to-primary-light/10 text-primary-dark shadow-custom'
                            : 'border-opacity-0 text-grey-dark hover:bg-grey-light hover:text-grey-dark'
                        } `}
                      >
                        <div
                          className={`flex-shrink-0 rounded-xl p-2 ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-light to-primary text-white'
                              : 'bg-grey-light text-grey'
                          } `}
                        >
                          <IconComponent className="h-4 w-4 2xl:h-5 2xl:w-5" />
                        </div>
                        <span className="text-sm font-medium 2xl:text-base">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </>
            )}
          </ul>

          {/* Bottom Section */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="text-center text-xs text-grey">
              <p>餐廳管理系統</p>
              <p className="mt-1">v1.0</p>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default SideBar;
