import React, { useState } from 'react';
import { Box, Container, TextField, Chip, Stack, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../components/Sidebar';
import PromptGrid from '../components/PromptGrid';
import WelcomeBanner from '../components/WelcomeBanner';
import { useAuth } from '../contexts/AuthContext';

// Define available categories
const CATEGORIES = [
  'All',
  'Writing',
  'Art & Design',
  'Development',
  'Business',
  'Marketing',
  'Education',
  'Other'
];

function DashboardLayout() {
  const { user } = useAuth();
  // Initialize state with default values
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedAiModel, setSelectedAiModel] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'All');
      if (newCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        setSelectedCategories(filtered.length === 0 ? ['All'] : filtered);
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0A1929' }}>
      {/* Show WelcomeBanner only for non-logged-in users */}
      {!user && <WelcomeBanner />}
      
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Sidebar
            selectedAiModel={selectedAiModel}
            priceRange={priceRange}
            sortBy={sortBy}
            onAiModelChange={setSelectedAiModel}
            onPriceRangeChange={setPriceRange}
            onSortByChange={setSortBy}
          />
          <Box sx={{ flexGrow: 1 }}>
            {/* Search and Categories Section */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryClick(category)}
                    color={selectedCategories.includes(category) ? "primary" : "default"}
                    variant={selectedCategories.includes(category) ? "filled" : "outlined"}
                    sx={{ 
                      m: 0.5,
                      '&.MuiChip-root': {
                        borderRadius: '16px',
                        fontWeight: selectedCategories.includes(category) ? 600 : 400,
                        backgroundColor: selectedCategories.includes(category) ? undefined : 'transparent',
                        borderColor: selectedCategories.includes(category) ? undefined : (theme) => theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: selectedCategories.includes(category) ? undefined : 'rgba(33, 150, 243, 0.04)',
                        },
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
            
            {/* Prompt Grid */}
            <PromptGrid
              categories={selectedCategories}
              aiModel={selectedAiModel}
              priceRange={priceRange}
              sortBy={sortBy}
              searchQuery={searchQuery}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default DashboardLayout; 