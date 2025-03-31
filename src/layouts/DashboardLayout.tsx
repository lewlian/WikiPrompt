import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PromptGrid from '../components/PromptGrid';

function DashboardLayout() {
  // Initialize state with default values
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAiModel, setSelectedAiModel] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3, display: 'flex', gap: 3 }}>
        <Sidebar
          selectedCategory={selectedCategory}
          selectedAiModel={selectedAiModel}
          priceRange={priceRange}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onAiModelChange={setSelectedAiModel}
          onPriceRangeChange={setPriceRange}
          onSortByChange={setSortBy}
        />
        <Box sx={{ flexGrow: 1 }}>
          <PromptGrid
            category={selectedCategory}
            aiModel={selectedAiModel}
            priceRange={priceRange}
            sortBy={sortBy}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardLayout; 