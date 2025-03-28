import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { Database } from '../../types/database.types';
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
import PromptPackManager from '../../components/PromptPackManager';

type PromptPack = Database['public']['Tables']['prompt_packs']['Row'] & {
  creator_profiles?: {
    display_name: string;
    avatar_url: string | null;
  };
  creator_name?: string;
  creator_avatar?: string;
};

// Fallback image for when preview is not available
const FALLBACK_IMAGE = 'https://placehold.co/400x400/e0e0e0/9e9e9e?text=No+Preview';

// Helper function to calculate grid columns
const getGridCols = (imageCount: number) => {
  if (imageCount === 1) return 1;
  if (imageCount === 2) return 2;
  return 2; // For 3+ images, show 2x2 grid
};

export default function PromptPackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [promptPack, setPromptPack] = useState<PromptPack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [relatedPacks, setRelatedPacks] = useState<PromptPack[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromptPack = async () => {
      if (!id) return;

      try {
        console.log('Fetching prompt pack with ID:', id); // Debug log

        const { data: packData, error: packError } = await supabase
          .from('prompt_packs')
          .select('*')
          .eq('id', id)
          .single();

        console.log('Raw pack data:', packData); // Debug log
        console.log('Pack error:', packError); // Debug log

        if (packError) {
          throw packError;
        }

        if (!packData) {
          console.error('No data returned for prompt pack');
          return;
        }

        // Get creator information
        const { data: creatorData, error: creatorError } = await supabase
          .from('creator_profiles')
          .select('display_name, avatar_url')
          .eq('id', packData.creator_id)
          .single();

        console.log('Creator data:', creatorData); // Debug log
        console.log('Creator error:', creatorError); // Debug log

        // Filter out any invalid URLs from preview_images
        const validPreviewImages = Array.isArray(packData.preview_images)
          ? packData.preview_images.filter((url: string) => typeof url === 'string' && url.trim() !== '')
          : [];

        console.log('Valid preview images:', validPreviewImages); // Debug log

        // Ensure all required fields are present
        const validPackData: PromptPack = {
          ...packData,
          preview_images: validPreviewImages,
          creator_name: creatorData?.display_name || 'Anonymous',
          creator_avatar: creatorData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorData?.display_name || 'anonymous'}`,
          category: packData.category || 'Uncategorized',
          price: packData.price || 0,
        };

        console.log('Processed pack data:', validPackData); // Debug log
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
          console.log('Fetching related packs for creator:', packData.creator_id); // Debug log

          // Get related packs
          const { data: relatedPacksData, error: relatedError } = await supabase
            .from('prompt_packs')
            .select('*')
            .eq('creator_id', packData.creator_id)
            .neq('id', id)
            .limit(3);

          console.log('Related packs data:', relatedPacksData); // Debug log
          console.log('Related packs error:', relatedError); // Debug log

          if (relatedError) {
            console.error('Error fetching related packs:', relatedError);
          }

          // Get creator info for related packs
          const validRelatedData = await Promise.all((relatedPacksData || []).map(async (pack) => {
            const { data: relatedCreatorData } = await supabase
              .from('creator_profiles')
              .select('display_name, avatar_url')
              .eq('id', pack.creator_id)
              .single();

            return {
              ...pack,
              preview_images: Array.isArray(pack.preview_images) 
                ? pack.preview_images.filter((url: string) => typeof url === 'string' && url.trim() !== '')
                : [],
              creator_name: relatedCreatorData?.display_name || 'Anonymous',
              creator_avatar: relatedCreatorData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${relatedCreatorData?.display_name || 'anonymous'}`,
              category: pack.category || 'Uncategorized',
              price: pack.price || 0,
            };
          }));

          console.log('Processed related packs:', validRelatedData); // Debug log
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
          <Box sx={{ 
            position: 'relative', 
            height: { xs: 300, sm: 400, md: 500 }, 
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'grey.100',
          }}>
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
              cols={getGridCols(promptPack.preview_images.length)} 
              rowHeight={promptPack.preview_images.length > 2 ? 250 : 500}
              gap={8}
            >
              {(promptPack.preview_images && promptPack.preview_images.length > 0
                ? promptPack.preview_images.slice(0, 4)
                : [FALLBACK_IMAGE]
              ).map((image, index) => (
                <ImageListItem 
                  key={index}
                  sx={{ overflow: 'hidden' }}
                >
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    loading="lazy"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
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
            {promptPack.preview_images && promptPack.preview_images.length > 4 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                +{promptPack.preview_images.length - 4} more
              </Box>
            )}
          </Box>

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
              <PromptPackManager 
                packId={promptPack.id} 
                creatorId={promptPack.creator_id}
                onDelete={() => navigate('/')} 
              />
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