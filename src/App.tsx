import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3, display: 'flex', gap: 3 }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1 }}>
            <PromptGrid />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
