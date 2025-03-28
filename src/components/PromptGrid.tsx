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
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <ImageList 
          sx={{ 
            width: '100%', 
            height: '100%', 
            m: 0,
            '& .MuiImageListItem-root': {
              padding: 0,
            },
          }} 
          cols={cols} 
          rowHeight={displayImages.length > 2 ? 100 : 200}
          gap={2}
        >
          {displayImages.map((image, index) => (
            <ImageListItem key={index}>
              <img
                src={image}
                alt={`${prompt.title} preview ${index + 1}`}
                loading="lazy"
                style={{ 
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  console.error('Image failed to load:', image); // Debug log
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
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" noWrap>
            {prompt.title}
          </Typography>
          <Chip 
            label={prompt.category || 'General'} 
            size="small" 
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 500,
            }} 
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {prompt.prompt}
        </Typography>

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={prompt.creator_avatar || FALLBACK_IMAGE} 
              alt={prompt.creator_name}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2" color="text.secondary" noWrap>
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

const PromptGrid: React.FC = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<PromptPackDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        // First get the prompt packs
        const { data: promptData, error: promptError } = await supabase
          .from('prompt_packs')
          .select('*');

        if (promptError) {
          throw promptError;
        }

        // Then get creator info for each prompt pack
        const promptsWithCreators = await Promise.all((promptData || []).map(async (prompt) => {
          const { data: creatorData } = await supabase
            .from('creator_profiles')
            .select('display_name')
            .eq('id', prompt.creator_id)
            .single();

          // Use the preview_images directly since they are already public URLs
          const previewImages = Array.isArray(prompt.preview_images) 
            ? prompt.preview_images.filter((url: string) => typeof url === 'string' && url.trim() !== '')
            : [];

          console.log('Raw prompt:', prompt); // Debug log
          console.log('Preview images:', previewImages); // Debug log

          return {
            ...prompt,
            preview_images: previewImages,
            creator_name: creatorData?.display_name || 'Anonymous',
            creator_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorData?.display_name || 'anonymous'}`,
            category: prompt.category || 'Uncategorized',
            price: typeof prompt.price === 'number' ? prompt.price : 0,
          };
        }));

        console.log('Processed prompts:', promptsWithCreators); // Debug log

        setPrompts(promptsWithCreators);
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