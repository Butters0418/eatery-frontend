import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import { PiBowlFoodFill } from 'react-icons/pi';
import { BsBagCheckFill } from 'react-icons/bs';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 根據當前路徑判斷選中狀態
  const getActiveIndex = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 0;
    if (path.includes('/dine-in')) return 1;
    if (path.includes('/takeout')) return 2;
    return 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(getActiveIndex());

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const menuItems = [
    {
      icon: FaClipboardList,
      label: '訂單管理',
      path: 'orders',
      index: 0,
    },
    {
      icon: PiBowlFoodFill,
      label: '內用點餐',
      path: 'dine-in',
      index: 1,
    },
    {
      icon: BsBagCheckFill,
      label: '外帶點餐',
      path: 'takeout',
      index: 2,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white shadow-custom md:w-72">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto md:top-20 md:h-[calc(100vh-5rem)]">
        <nav className="p-4 md:p-6">
          {/* header */}
          <div className="mb-6 md:mb-8">
            <h2 className="mb-2 text-lg font-semibold text-grey-dark md:text-xl">
              功能選單
            </h2>
            <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary-light to-primary" />
          </div>

          {/* menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = selectedIndex === item.index;

              return (
                <li key={item.index}>
                  <button
                    onClick={() => handleListItemClick(item.index, item.path)}
                    className={`flex min-h-[44px] w-full touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3 text-left md:min-h-[48px] md:py-4 ${
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
                      <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <span className="text-sm font-medium md:text-base">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                </li>
              );
            })}
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
