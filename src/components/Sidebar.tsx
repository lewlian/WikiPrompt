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
  sortBy: string;
  onAiModelChange: (model: string) => void;
  onSortByChange: (sort: string) => void;
}

const aiModels = ['All', 'GPT-4', 'GPT-3.5', 'Claude 2', 'Claude 3', 'Gemini Pro', 'Llama 2', 'Mistral', 'Other'];

const Sidebar: React.FC<SidebarProps> = ({
  selectedAiModel,
  sortBy,
  onAiModelChange,
  onSortByChange,
}) => {
  return (
    <Paper 
      sx={{ 
        width: 240,
        p: 2,
        flexShrink: 0,
        position: 'sticky',
        top: 24,
        height: 'fit-content',
        bgcolor: 'rgba(30, 41, 59, 0.5)',
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
    </Paper>
  );
};

export default Sidebar; 