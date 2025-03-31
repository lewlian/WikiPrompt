import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Chip,
  Paper,
  InputAdornment,
  TextField,
  Stack,
  Grid
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import PromptGrid from '../components/PromptGrid';
import WelcomeBanner from '../components/WelcomeBanner';
import { useAuth } from '../contexts/AuthContext';

// Categories list (moved from sidebar)
const categories = ['Writing', 'Programming', 'Art & Design', 'Business', 'Education', 'Entertainment', 'Productivity', 'AI', 'Data Science', 'Marketing', 'Gaming', 'Web3', 'Mobile', 'OpenSource', 'Node', 'React', 'Solidity', 'Smart Contract', 'Zero Knowledge'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAiModel, setSelectedAiModel] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const clearSelectedCategories = () => {
    setSelectedCategories([]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0A1929' }}>
      {/* Show WelcomeBanner only for non-logged-in users */}
      {!user && <WelcomeBanner />}
      
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Sidebar */}
          <Box sx={{ width: { xs: '100%', md: '240px' }, flexShrink: 0 }}>
            <Sidebar
              selectedAiModel={selectedAiModel}
              priceRange={priceRange}
              sortBy={sortBy}
              onAiModelChange={setSelectedAiModel}
              onPriceRangeChange={setPriceRange}
              onSortByChange={setSortBy}
            />
          </Box>
          
          {/* Main Content */}
          <Box sx={{ flexGrow: 1 }}>
            {/* New Category and Search UI */}
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'rgba(30, 41, 59, 0.5)', 
                borderRadius: 2,
                color: 'white'
              }}
            >
              {/* Search bar */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Categories */}
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Categories
              </Typography>
              
              {/* Category chips */}
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryToggle(category)}
                    sx={{
                      bgcolor: selectedCategories.includes(category) 
                        ? 'primary.main'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: selectedCategories.includes(category)
                          ? 'primary.dark'
                          : 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Selected categories */}
              {selectedCategories.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      Selected:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'primary.main',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={clearSelectedCategories}
                    >
                      Clear all
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedCategories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onDelete={() => removeCategory(category)}
                        sx={{
                          bgcolor: 'primary.dark',
                          color: 'white',
                          mb: 1,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

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
};

export default Dashboard; 