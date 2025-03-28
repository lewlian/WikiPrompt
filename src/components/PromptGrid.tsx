import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Avatar,
  Skeleton,
} from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { PromptPackDetails } from '../types/supabase';

// Fallback image for when preview is not available
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Preview';

interface PromptCardProps {
  prompt: PromptPackDetails;
  onClick: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  // Get the first preview image or fallback
  const previewImage = prompt.preview_images && prompt.preview_images.length > 0
    ? prompt.preview_images[0]
    : FALLBACK_IMAGE;

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        '&:hover': {
          cursor: 'pointer',
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={previewImage}
        alt={prompt.title}
        onError={(e) => {
          // If image fails to load, replace with fallback
          const target = e.target as HTMLImageElement;
          if (target.src !== FALLBACK_IMAGE) {
            target.src = FALLBACK_IMAGE;
          }
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {prompt.title}
        </Typography>
        <Box sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center' }}>
          <Chip
            label={prompt.category}
            size="small"
            sx={{ mr: 1 }}
          />
          <Avatar
            src={prompt.creator_avatar}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary" component="span">
            {prompt.creator_name}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          ${prompt.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PromptGrid: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<PromptPackDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('prompt_pack_details')
          .select('*');

        if (error) {
          throw error;
        }

        // Ensure all required fields are present
        const validPrompts = (data || []).map(prompt => ({
          ...prompt,
          preview_images: prompt.preview_images || [],
          creator_avatar: prompt.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.creator_name}`,
          category: prompt.category || 'Uncategorized',
          price: prompt.price || 0,
        }));

        setPrompts(validPrompts);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)'
      }}}>
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)'
    }}}>
      {prompts.map((prompt) => (
        <Box key={prompt.id}>
          <PromptCard 
            prompt={prompt} 
            onClick={() => navigate(`/prompt/${prompt.id}`)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default PromptGrid; 