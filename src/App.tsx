import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthPage from './pages/auth';
import PromptPackDetailPage from './pages/prompt/[id]';
import UploadPage from './pages/upload/UploadPage';
import Profile from './pages/Profile';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardLayout />} />
              <Route path="/prompt/:id" element={<PromptPackDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
