import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  Chip,
  Avatar,
  IconButton,
  Skeleton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { PromptPackDetails } from '../../types/supabase';

// Fallback image for when preview is not available
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Preview';

export default function PromptPackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [promptPack, setPromptPack] = useState<PromptPackDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [relatedPacks, setRelatedPacks] = useState<PromptPackDetails[]>([]);

  useEffect(() => {
    const fetchPromptPack = async () => {
      if (!id) return;

      try {
        const { data: packData, error: packError } = await supabase
          .from('prompt_pack_details')
          .select('*')
          .eq('id', id)
          .single();

        if (packError) {
          throw packError;
        }

        // Ensure all required fields are present
        const validPackData = {
          ...packData,
          preview_images: packData.preview_images || [],
          creator_avatar: packData.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${packData.creator_name}`,
          category: packData.category || 'Uncategorized',
          price: packData.price || 0,
        };

        setPromptPack(validPackData);

        // Check if user has purchased
        if (user) {
          const { data: purchaseData } = await supabase
            .rpc('has_user_purchased', { pack_id: id });
          setHasPurchased(!!purchaseData);

          // Check if user has favorited
          const { data: favoriteData } = await supabase
            .rpc('has_user_favorited', { pack_id: id });
          setIsFavorited(!!favoriteData);
        }

        // Fetch related packs by same creator
        if (packData) {
          const { data: relatedData } = await supabase
            .from('prompt_pack_details')
            .select('*')
            .eq('creator_id', packData.creator_id)
            .neq('id', id)
            .limit(3);

          // Apply the same data validation to related packs
          const validRelatedData = (relatedData || []).map(pack => ({
            ...pack,
            preview_images: pack.preview_images || [],
            creator_avatar: pack.creator_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pack.creator_name}`,
            category: pack.category || 'Uncategorized',
            price: pack.price || 0,
          }));

          setRelatedPacks(validRelatedData);
        }
      } catch (error) {
        console.error('Error fetching prompt pack:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromptPack();
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user || !promptPack) return;

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_pack_id', promptPack.id);
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, prompt_pack_id: promptPack.id });
    }

    setIsFavorited(!isFavorited);
  };

  const handlePurchase = async () => {
    // This will be implemented later with Stripe
    console.log('Purchase functionality to be implemented');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: '0 0 66.666667%' }}>
            <Skeleton variant="rectangular" height={400} />
          </Box>
          <Box sx={{ flex: '0 0 33.333333%' }}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!promptPack) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4">Prompt pack not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Left column */}
        <Box sx={{ flex: { xs: '0 0 100%', md: '0 0 66.666667%' } }}>
          {/* Image Gallery */}
          <ImageList cols={2} gap={16}>
            {(promptPack.preview_images.length > 0 ? promptPack.preview_images : [FALLBACK_IMAGE]).map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: 8, width: '100%', height: 'auto' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== FALLBACK_IMAGE) {
                      target.src = FALLBACK_IMAGE;
                    }
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>

          {/* Prompt Content */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {hasPurchased ? <LockOpenIcon /> : <LockIcon />}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Prompt Content
                </Typography>
              </Box>
              {hasPurchased ? (
                <Typography>{promptPack.full_prompt}</Typography>
              ) : (
                <Typography color="text.secondary">
                  Purchase this prompt pack to unlock the content
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right column */}
        <Box sx={{ flex: { xs: '0 0 100%', md: '0 0 33.333333%' } }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            {/* Title and Price */}
            <Typography variant="h4" gutterBottom>
              {promptPack.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" color="primary">
                ${promptPack.price}
              </Typography>
              <IconButton onClick={handleFavorite} sx={{ ml: 1 }}>
                {isFavorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
            <Chip label={promptPack.category} sx={{ mb: 2 }} />

            {/* Purchase Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePurchase}
              disabled={hasPurchased}
              sx={{ mb: 4 }}
            >
              {hasPurchased ? 'Purchased' : 'Purchase Now'}
            </Button>

            {/* Creator Info */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={promptPack.creator_avatar} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">{promptPack.creator_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Creator
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{promptPack.description}</Typography>
              </CardContent>
            </Card>

            {/* Related Packs */}
            {relatedPacks.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  More from this creator
                </Typography>
                {relatedPacks.map((pack) => (
                  <Card key={pack.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">{pack.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${pack.price}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 