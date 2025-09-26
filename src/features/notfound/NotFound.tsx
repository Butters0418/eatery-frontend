import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BiSolidError } from 'react-icons/bi';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-4 flex items-center justify-center">
        <BiSolidError className="text-7xl text-error" />
        <p className="text-6xl font-bold">404</p>
      </h1>
      <h2 className="mb-6 text-2xl font-semibold text-gray-600">找不到頁面</h2>
      <p className="mb-8 max-w-md text-gray-500">抱歉，您要查找的頁面不存在</p>

      <div className="space-x-4">
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          <p className="text-xl">回到首頁</p>
        </Button>
      </div>
    </div>
  );
}
export default NotFound;
