import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  ImageList,
  ImageListItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface PromptPackDetails {
  id: string;
  title: string;
  category?: string;
  preview_images: string[];
  creator_name?: string;
  creator_avatar?: string;
  creator_avatar_url?: string;
  created_at: string;
  favorite_count: number;
  favorites?: { count: number }[];
  is_favorited?: boolean;
}

interface PromptCardProps {
  prompt: PromptPackDetails;
  onClick: () => void;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x400/e0e0e0/9e9e9e?text=No+Preview';

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(prompt.is_favorited || false);
  const [favoriteCount, setFavoriteCount] = useState(
    typeof prompt.favorite_count === 'number' 
      ? prompt.favorite_count 
      : prompt.favorites?.[0]?.count || 0
  );

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('prompt_pack_id', prompt.id);

        if (error) throw error;
        setIsFavorited(false);
        setFavoriteCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            prompt_pack_id: prompt.id,
          });

        if (error) throw error;
        setIsFavorited(true);
        setFavoriteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const previewImages = Array.isArray(prompt.preview_images) && prompt.preview_images.length > 0
    ? prompt.preview_images.filter(url => typeof url === 'string' && url.trim() !== '')
    : [FALLBACK_IMAGE];

  const getGridCols = (imageCount: number) => {
    if (imageCount === 1) return 1;
    if (imageCount === 2) return 2;
    return 2;
  };

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
            overflow: 'hidden',
            '& .MuiImageListItem-root': {
              padding: 0,
              overflow: 'hidden',
            },
          }} 
          cols={cols} 
          rowHeight={displayImages.length > 2 ? 100 : 200}
          gap={2}
        >
          {displayImages.map((image, index) => (
            <ImageListItem 
              key={index}
              sx={{ overflow: 'hidden' }}
            >
              <img
                src={image}
                alt={`${prompt.title} preview ${index + 1}`}
                loading="lazy"
                style={{ 
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                  display: 'block',
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
        '&:last-child': { pb: 2 },
      }}>
        {/* Row 1: Title */}
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {prompt.title}
        </Typography>

        {/* Row 2: Category */}
        <Box sx={{ mb: 2 }}>
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

        {/* Row 3: Creator info and favorite count */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={prompt.creator_avatar || prompt.creator_avatar_url || 
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.creator_name || 'anonymous'}`} 
              sx={{ width: 24, height: 24 }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {prompt.creator_name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={!user ? "Sign in to favorite" : (isFavorited ? "Remove from favorites" : "Add to favorites")}
            >
              <IconButton 
                size="small" 
                onClick={handleFavorite}
                sx={{ 
                  color: isFavorited ? 'error.main' : 'text.secondary',
                  '&:hover': {
                    color: isFavorited ? 'error.dark' : 'text.primary',
                  }
                }}
              >
                {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              {favoriteCount}
            </Typography>
          </Box>
        </Box>

        {/* Row 4: Upload date */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            mt: 'auto',
          }}
        >
          {formatDate(prompt.created_at)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PromptCard; 