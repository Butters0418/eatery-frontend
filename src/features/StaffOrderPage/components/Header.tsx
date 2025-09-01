import useAuthStore from '../../../stores/useAuthStore';

// 配合專案色調的Header組件 - 平板響應式設計
function Header() {
  const { account, role, setLogout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 shadow-custom backdrop-blur-md">
      <div className="mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tight text-grey-dark md:text-2xl">
              餐廳點餐系統
            </h1>
            <div className="hidden h-6 w-px bg-gray-300 md:block" />
            <span className="md:inline-text hidden text-sm font-medium text-grey">
              店員後台
            </span>
          </div>

          {/* 使用者資訊 */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-light to-primary shadow-custom md:h-10 md:w-10">
                <span className="text-sm font-semibold text-white md:text-base">
                  {account?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-grey-dark md:text-base">
                  {account}
                </p>
                <p className="text-xs text-grey">
                  {role === 'admin' ? '管理員' : '店員'}
                </p>
              </div>
            </div>

            <button
              onClick={setLogout}
              className="inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-grey-dark hover:border-primary-light hover:bg-grey-light md:px-6 md:py-2.5 md:text-base"
            >
              <span>登出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
