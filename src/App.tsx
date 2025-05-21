import AppRoutes from './routes/AppRoutes';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffaa00',
      light: '#ffbb33',
      dark: '#cc8800',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f4a7b9',
      light: '#f8c4d1',
      dark: '#d37d90',
      contrastText: '#333333',
    },
    warning: {
      main: '#d3381c',
      light: '#e25c4f',
      dark: '#a82c16',
      contrastText: '#ffffff',
    },
    info: {
      main: '#58a6dc',
      light: '#7fbce6',
      dark: '#357bb3',
      contrastText: '#ffffff',
    },
    success: {
      main: '#91c788',
      light: '#afd4aa',
      dark: '#6f9f66',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f5ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
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
