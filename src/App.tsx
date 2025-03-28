import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthPage } from './pages/auth/AuthPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromptGrid from './components/PromptGrid';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
});

// Dashboard layout component
const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, mt: 3, mb: 3 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, px: 3 }}>
          <PromptGrid />
        </Box>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<DashboardLayout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
