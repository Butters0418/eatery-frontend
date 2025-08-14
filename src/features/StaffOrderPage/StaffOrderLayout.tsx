import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import SideBar from './components/SideBar';

// 員工點餐頁 (staff 及 admin 可造訪)
function StaffOrderLayout() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-300">
      <div className="container m-auto min-h-[px] overflow-hidden rounded-md shadow-md">
        <Header />
        <div>
          <SideBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default StaffOrderLayout;
