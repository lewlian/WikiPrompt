import React, { useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import Sidebar from '../components/Sidebar';
import PromptGrid from '../components/PromptGrid';

const Dashboard: React.FC = () => {
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAiModel, setSelectedAiModel] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={2}>
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
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <PromptGrid
              category={selectedCategory}
              aiModel={selectedAiModel}
              priceRange={priceRange}
              sortBy={sortBy}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 