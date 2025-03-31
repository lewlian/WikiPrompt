import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';

interface SidebarProps {
  selectedAiModel: string;
  priceRange: number[];
  sortBy: string;
  onAiModelChange: (model: string) => void;
  onPriceRangeChange: (range: number[]) => void;
  onSortByChange: (sort: string) => void;
}

const aiModels = ['All', 'GPT-4', 'GPT-3.5', 'Claude 2', 'Claude 3', 'Gemini Pro', 'Llama 2', 'Mistral', 'Other'];

const Sidebar: React.FC<SidebarProps> = ({
  selectedAiModel,
  priceRange,
  sortBy,
  onAiModelChange,
  onPriceRangeChange,
  onSortByChange,
}) => {
  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    onPriceRangeChange(newValue as number[]);
  };

  const handleMinPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Math.max(0, Number(event.target.value)), priceRange[1]);
    onPriceRangeChange([newMin, priceRange[1]]);
  };

  const handleMaxPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Math.min(100, Number(event.target.value)), priceRange[0]);
    onPriceRangeChange([priceRange[0], newMax]);
  };

  return (
    <Paper 
      sx={{ 
        width: 240,
        p: 2,
        flexShrink: 0, // Prevent the sidebar from shrinking
        position: 'sticky', // Make the sidebar sticky
        top: 24, // Add some top spacing
        height: 'fit-content', // Allow the height to adjust to content
        bgcolor: 'rgba(30, 41, 59, 0.5)', // Match the category section style
        color: 'white',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortByChange(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              }
            }}
          >
            <MenuItem value="popular">Popular</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          AI Model
        </Typography>
        <List dense>
          {aiModels.map((model) => (
            <ListItemButton 
              key={model}
              selected={model === selectedAiModel}
              onClick={() => onAiModelChange(model)}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <ListItemText primary={model} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Price Range
        </Typography>
        <Box sx={{ px: 1 }}> {/* Add padding to prevent slider from touching edges */}
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            sx={{
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                color: 'primary.main',
              },
              '& .MuiSlider-track': {
                height: 4,
                color: 'primary.main',
              },
              '& .MuiSlider-rail': {
                color: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          mt: 1,
          px: 1
        }}>
          <TextField
            size="small"
            label="Min"
            type="number"
            value={priceRange[0]}
            onChange={handleMinPriceInput}
            inputProps={{ 
              min: 0,
              max: priceRange[1],
              style: { width: '80px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
          <TextField
            size="small"
            label="Max"
            type="number"
            value={priceRange[1]}
            onChange={handleMaxPriceInput}
            inputProps={{ 
              min: priceRange[0],
              max: 100,
              style: { width: '80px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
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
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Sidebar; 