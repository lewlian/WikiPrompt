import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from '@mui/material';

// Mock data for the prompts
const mockPrompts = [
  {
    id: 1,
    title: 'Typography Poster Designs',
    category: 'Posters',
    creator: 'Lorraine D.',
    price: 7,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Vintage Logo Pack',
    category: 'Branding',
    creator: 'Jason W.',
    price: 7,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Colorful Illustration Pack',
    category: 'Branding',
    creator: 'Jon Wun',
    price: 12,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 4,
    title: 'Clean Poster Layouts',
    category: 'Posters',
    creator: 'Thomas',
    price: 10,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 5,
    title: 'Album Cover Art',
    category: 'Album Covers',
    creator: 'John Wik',
    price: 3,
    image: 'https://via.placeholder.com/300x200',
    isFree: true,
  },
  {
    id: 6,
    title: 'App UI Concepts',
    category: 'UI Design',
    creator: 'Alex Hu',
    price: 4,
    image: 'https://via.placeholder.com/300x200',
  },
];

interface PromptCardProps {
  prompt: {
    id: number;
    title: string;
    category: string;
    creator: string;
    price: number;
    image: string;
    isFree?: boolean;
  };
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '&:hover': {
          cursor: 'pointer',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={prompt.image}
        alt={prompt.title}
        sx={{ filter: 'blur(5px)' }}
      />
      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {prompt.title}
        </Typography>
        <Box sx={{ mt: 1, mb: 1 }}>
          <Chip
            label={prompt.category}
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary" component="span">
            {prompt.creator}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          {prompt.isFree ? 'Free' : `$${prompt.price}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PromptGrid: React.FC = () => {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)'
    }}}>
      {mockPrompts.map((prompt) => (
        <Box key={prompt.id}>
          <PromptCard prompt={prompt} />
        </Box>
      ))}
    </Box>
  );
};

export default PromptGrid; 