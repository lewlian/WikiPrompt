import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AuthPage from './pages/auth/AuthPage';
import PromptPackDetailPage from './pages/prompt/[id]';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/prompt/:id" element={<PromptPackDetailPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
