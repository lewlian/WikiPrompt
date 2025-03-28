import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PromptGrid from '../components/PromptGrid';

function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3, display: 'flex', gap: 3 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <PromptGrid />
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardLayout; 