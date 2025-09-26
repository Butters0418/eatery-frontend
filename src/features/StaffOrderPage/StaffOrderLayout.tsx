import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import SideBar from './components/SideBar';

// 員工點餐頁 (staff 及 admin 可造訪)
function StaffOrderLayout() {
  return (
    <div className="min-h-screen bg-grey-light">
      <Header />

      <div className="flex">
        <SideBar />
        {/* 主內容區 */}
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="p-4 md:p-6 2xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
export default StaffOrderLayout;
