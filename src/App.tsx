import AppRoutes from './routes/AppRoutes';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FF9B54',
      main: '#FF7629',
      dark: '#E35A00',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#F0F9FF',
      main: '#38B2AC',
      dark: '#2C7A7B',
      contrastText: '#ffffff',
    },
    error: {
      light: '#FF7A70',
      main: '#FF4B3E',
      dark: '#CC392F',
      contrastText: '#ffffff',
    },
    grey: {
      100: '#F7F7F7',
      500: '#6B7280',
      900: '#374151',
    },
  },
  shape: {
    borderRadius: 16, // 預設圓角（看你是否想對應 xl 或 2xl）
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}
export default App;
