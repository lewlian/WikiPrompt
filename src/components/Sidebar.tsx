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
} from '@mui/material';

const categories = ['Posters', 'Branding', 'Album Covers', 'UI Design'];
const aiModels = ['All Models', 'Midjourney', 'DALL-E'];

const Sidebar = () => {
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 100]);
  const [sortBy, setSortBy] = React.useState('trending');

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  return (
    <Paper sx={{ width: 240, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Categories
        </Typography>
        <List dense>
          {categories.map((category) => (
            <ListItemButton key={category}>
              <ListItemText primary={category} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          AI Model
        </Typography>
        <List dense>
          {aiModels.map((model) => (
            <ListItemButton key={model}>
              <ListItemText primary={model} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="trending">Trending</MenuItem>
            <MenuItem value="popular">Popular</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Sidebar; 