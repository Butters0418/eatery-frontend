import useAuthStore from '../../../stores/useAuthStore';
function Header() {
  const { account, setLogout } = useAuthStore();
  return (
    <header className="flex items-center gap-4 bg-white p-3">
      <h1 className="mr-auto text-xl">xxx點餐頁</h1>
      <p> {account} 您好</p>
      <button onClick={setLogout}>登出</button>
    </header>
  );
}
export default Header;
