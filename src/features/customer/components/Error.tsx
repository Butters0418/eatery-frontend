// Icons
import { BiSolidError } from 'react-icons/bi';

// 錯誤頁面組件
function Error() {
  // ===== 渲染 UI =====
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-grey-light md:gap-4">
      <BiSolidError className="text-[50px] text-error md:text-[100px]" />
      <p className="text-lg text-grey-dark md:text-2xl">
        係統錯誤，請稍後再試 !
      </p>
    </div>
  );
}
export default Error;
