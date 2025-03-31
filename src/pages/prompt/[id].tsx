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
  CircularProgress,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PromptPackManager from '../../components/PromptPackManager';

type PromptPack = Database['public']['Tables']['prompt_packs']['Row'] & {
  creator_name?: string;
  creator_avatar?: string;
};

type CreatorData = {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
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
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [relatedPacks, setRelatedPacks] = useState<PromptPack[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  useEffect(() => {
    const fetchPromptPack = async () => {
      if (!id) return;

      try {
        const { data: packData, error: packError } = await supabase
          .from('prompt_packs')
          .select(`
            *,
            favorites:favorites(count)
          `)
          .eq('id', id)
          .single();

        if (packError) {
          throw packError;
        }

        if (!packData) {
          console.error('No data returned for prompt pack');
          return;
        }

        // Get favorite status if user is logged in
        let isFavoritedByUser = false;
        if (user) {
          const { data: favoriteData } = await supabase
            .from('favorites')
            .select()
            .eq('user_id', user.id)
            .eq('prompt_pack_id', id)
            .maybeSingle();
          
          isFavoritedByUser = !!favoriteData;
        }

        // Get creator information
        const { data: creatorData, error: creatorError } = await supabase
          .from('users')
          .select('full_name, username, avatar_url')
          .eq('id', packData.creator_id)
          .single() as { data: CreatorData | null, error: any };

        // Filter out any invalid URLs from preview_images
        const validPreviewImages = Array.isArray(packData.preview_images)
          ? packData.preview_images.filter((url: string) => typeof url === 'string' && url.trim() !== '')
          : [];

        // Ensure all required fields are present
        const validPackData: PromptPack = {
          ...packData,
          preview_images: validPreviewImages,
          creator_name: creatorData?.full_name || creatorData?.username || 'Anonymous',
          creator_avatar: creatorData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorData?.full_name || creatorData?.username || 'anonymous'}`,
          category: packData.category || 'Uncategorized',
          price: packData.price || 0,
        };

        setPromptPack(validPackData);
        setFavoriteCount(packData.favorites?.[0]?.count || 0);
        setIsFavorited(isFavoritedByUser);

        // Check if user has purchased
        if (user) {
          const { data: purchaseData } = await supabase
            .rpc('has_user_purchased', { pack_id: id });
          setHasPurchased(!!purchaseData);
        }

        // Fetch related packs by same creator
        if (packData) {
          const { data: relatedPacksData, error: relatedError } = await supabase
            .from('prompt_packs')
            .select(`
              *,
              favorites:favorites(count)
            `)
            .eq('creator_id', packData.creator_id)
            .neq('id', id)
            .limit(3);

          if (relatedError) {
            console.error('Error fetching related packs:', relatedError);
          }

          // Get user's favorites for related packs
          let userFavorites: string[] = [];
          if (user) {
            const { data: favoritesData } = await supabase
              .from('favorites')
              .select('prompt_pack_id')
              .eq('user_id', user.id)
              .in('prompt_pack_id', relatedPacksData?.map(p => p.id) || []);
            
            userFavorites = favoritesData?.map(f => f.prompt_pack_id) || [];
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
              favorite_count: pack.favorites?.[0]?.count || 0,
              is_favorited: userFavorites.includes(pack.id)
            };
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
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }

    if (!promptPack) return;

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('prompt_pack_id', promptPack.id);
        setFavoriteCount(prev => prev - 1);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, prompt_pack_id: promptPack.id });
        setFavoriteCount(prev => prev + 1);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/auth?mode=signin');
      return;
    }

    if (!promptPack) return;

    try {
      setIsPurchasing(true);

      if (hasPurchased) {
        // Delete the purchase
        const { error: deleteError } = await supabase
          .from('purchases')
          .delete()
          .eq('user_id', user.id)
          .eq('prompt_pack_id', promptPack.id);

        if (deleteError) throw deleteError;
        setHasPurchased(false);
      } else {
        // Create a new purchase
        const { error: purchaseError } = await supabase
          .from('purchases')
          .insert({
            user_id: user.id,
            prompt_pack_id: promptPack.id,
            amount: promptPack.price
          });

        if (purchaseError) throw purchaseError;
        setHasPurchased(true);
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => {
        setIsPurchasing(false);
      }, 2000);
    }
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
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'rgb(15, 23, 42)',
      color: 'white',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <Container maxWidth={false} sx={{ 
        height: '100%',
        px: { xs: 2, sm: 4, md: 6, lg: 8 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          py: 4,
          maxWidth: '1800px',
          mx: 'auto'
        }}>
          {/* Left column - Image Gallery */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            position: { xs: 'relative', md: 'sticky' },
            top: 24,
            alignSelf: 'flex-start',
            height: 'fit-content'
          }}>
            <Box sx={{ 
              position: 'relative', 
              height: { xs: 300, sm: 400, md: 500 }, 
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'rgba(30, 41, 59, 0.5)',
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
            </Box>
          </Box>

          {/* Right column - Content */}
          <Box sx={{ 
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            pb: 4
          }}>
            {/* Title */}
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              {promptPack.title}
            </Typography>
            
            {/* Price and Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2
            }}>
              <Typography variant="h5" sx={{ color: 'rgb(37, 99, 235)' }}>
                ${promptPack.price}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Uploaded on {formatDate(promptPack.created_at)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleFavorite} sx={{ color: 'white' }}>
                  {isFavorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {favoriteCount}
                </Typography>
              </Box>
              <PromptPackManager 
                packId={promptPack.id} 
                creatorId={promptPack.creator_id}
                onDelete={() => navigate('/')} 
              />
            </Box>

            {/* Category */}
            <Chip 
              label={promptPack.category} 
              sx={{ 
                alignSelf: 'flex-start',
                bgcolor: 'rgb(37, 99, 235)',
                color: 'white',
                mb: 2
              }} 
            />

            {/* Purchase Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePurchase}
              disabled={isPurchasing}
              sx={{ 
                bgcolor: hasPurchased ? 'rgb(22, 163, 74)' : 'rgb(37, 99, 235)',
                '&:hover': {
                  bgcolor: hasPurchased ? 'rgb(21, 128, 61)' : 'rgb(29, 78, 216)'
                },
                mb: 3
              }}
            >
              {isPurchasing ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                hasPurchased ? 'Purchased' : 'Purchase Now'
              )}
            </Button>

            {/* Creator Info */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}>
              <Avatar src={promptPack.creator_avatar} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  {promptPack.creator_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Creator
                </Typography>
              </Box>
            </Box>

            {/* Prompt Content */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: 1,
              mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {hasPurchased ? <LockOpenIcon /> : <LockIcon />}
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Prompt Content
                </Typography>
              </Box>
              <Typography sx={{ color: hasPurchased ? 'white' : 'rgba(255, 255, 255, 0.7)' }}>
                {hasPurchased ? promptPack.full_prompt : 'Purchase this prompt pack to unlock the content'}
              </Typography>
            </Box>

            {/* Related Packs */}
            {relatedPacks.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
                  More from this creator
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {relatedPacks.map((pack) => (
                    <Box 
                      key={pack.id} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(30, 41, 59, 0.7)'
                        }
                      }}
                      onClick={() => navigate(`/prompt/${pack.id}`)}
                    >
                      <Typography variant="subtitle1" sx={{ color: 'white' }}>
                        {pack.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        ${pack.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 