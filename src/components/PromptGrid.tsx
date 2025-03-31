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
  ImageList,
  ImageListItem,
} from '@mui/material';
import { supabase } from '../lib/supabaseClient';

interface PromptPackDetails {
  id: string;
  title: string;
  prompt: string;
  full_prompt?: string;
  ai_model?: string;
  category?: string;
  price: number;
  preview_images: string[];
  creator_name?: string;
  creator_avatar?: string;
  created_at: string;
  updated_at: string;
}

// Update the fallback image to a more reliable source
const FALLBACK_IMAGE = 'https://placehold.co/400x400/e0e0e0/9e9e9e?text=No+Preview';

interface PromptCardProps {
  prompt: PromptPackDetails;
  onClick: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  // Get preview images or use fallback
  const previewImages = Array.isArray(prompt.preview_images) && prompt.preview_images.length > 0
    ? prompt.preview_images.filter(url => typeof url === 'string' && url.trim() !== '')
    : [FALLBACK_IMAGE];

  console.log('Preview images for prompt:', prompt.title, previewImages); // Debug log

  // Calculate grid columns based on number of images
  const getGridCols = (imageCount: number) => {
    if (imageCount === 1) return 1;
    if (imageCount === 2) return 2;
    return 2; // For 3+ images, show 2x2 grid
  };

  // Get at most 4 images for the collage
  const displayImages = previewImages.slice(0, 4);
  const cols = getGridCols(displayImages.length);

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        width: '100%',
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
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <ImageList 
          sx={{ 
            width: '100%', 
            height: '100%', 
            m: 0,
            overflow: 'hidden', // Prevent scrollbars
            '& .MuiImageListItem-root': {
              padding: 0,
              overflow: 'hidden', // Ensure images don't cause overflow
            },
          }} 
          cols={cols} 
          rowHeight={displayImages.length > 2 ? 100 : 200}
          gap={2}
        >
          {displayImages.map((image, index) => (
            <ImageListItem 
              key={index}
              sx={{ overflow: 'hidden' }} // Ensure consistent overflow handling
            >
              <img
                src={image}
                alt={`${prompt.title} preview ${index + 1}`}
                loading="lazy"
                style={{ 
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  display: 'block', // Prevent inline image spacing
                }}
                onError={(e) => {
                  console.error('Image failed to load:', image);
                  const target = e.target as HTMLImageElement;
                  if (target.src !== FALLBACK_IMAGE) {
                    target.src = FALLBACK_IMAGE;
                  }
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
        {previewImages.length > 4 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              px: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            +{previewImages.length - 4}
          </Box>
        )}
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        '&:last-child': { pb: 2 }, // Override MUI's default padding
      }}>
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="h6" 
            component="h2" 
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.2,
              maxWidth: 'calc(100% - 80px)', // Leave space for the chip
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {prompt.title}
          </Typography>
          <Chip 
            label={prompt.category || 'General'} 
            size="small" 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 500,
              flexShrink: 0,
            }} 
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 'auto',
            minHeight: '2.5em',
          }}
        >
          {prompt.prompt}
        </Typography>

        <Box sx={{ 
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={prompt.creator_avatar || FALLBACK_IMAGE} 
              alt={prompt.creator_name}
              sx={{ width: 24, height: 24 }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {prompt.creator_name || 'Anonymous'}
            </Typography>
          </Box>
          
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            color="primary"
          >
            {prompt.price ? `$${prompt.price.toFixed(2)}` : 'Free'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface PromptGridProps {
  category: string;
  aiModel: string;
  priceRange: number[];
  sortBy: string;
}

const PromptGrid: React.FC<PromptGridProps> = ({
  category,
  aiModel,
  priceRange,
  sortBy,
}) => {
  const [prompts, setPrompts] = useState<PromptPackDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('prompt_packs').select('*');

      // Apply filters
      if (category !== 'All') {
        query = query.eq('category', category);
      }
      if (aiModel !== 'All') {
        query = query.eq('ai_model', aiModel);
      }
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('downloads', { ascending: false });
          break;
        case 'trending':
          query = query.order('views', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [category, aiModel, priceRange, sortBy]);

  if (loading) {
    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', p: 3 }}>
        {[1, 2, 3, 4].map((key) => (
          <Skeleton 
            key={key} 
            variant="rectangular" 
            sx={{ 
              height: 400,
              borderRadius: 2,
            }} 
          />
        ))}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        p: 3,
      }}
    >
      {prompts.map((prompt) => (
        <Box 
          key={prompt.id}
          sx={{ 
            height: 400, // Fixed height for all cards
            display: 'flex',
          }}
        >
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