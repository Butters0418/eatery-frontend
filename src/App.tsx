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
    info: {
      light: '#F7F7F7',
      main: '#878b95',
      dark: '#374151',
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
    borderRadius: 16,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}
export default App;
