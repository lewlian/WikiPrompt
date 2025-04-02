import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Skeleton,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useUserProfile } from '../hooks/useUserProfile';
import PromptCard from '../components/PromptCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserProfile {
  avatar_url: string | null;
  username: string | null;
  bio: string | null;
  full_name: string | null;
}

interface PromptPackDetails {
  id: string;
  title: string;
  prompt: string;
  full_prompt?: string;
  ai_model?: string;
  category?: string;
  preview_images: string[];
  creator_name?: string;
  creator_avatar?: string;
  created_at: string;
  updated_at: string;
  favorite_count: number;
  is_favorited?: boolean;
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [myPacks, setMyPacks] = useState<PromptPackDetails[]>([]);
  const [likedPacks, setLikedPacks] = useState<PromptPackDetails[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile, refreshProfile } = useUserProfile();
  const navigate = useNavigate();

  const fetchMyPacks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch prompt packs with favorites count
      const { data: packsData, error: packsError } = await supabase
        .from('prompt_packs')
        .select(`
          *,
          favorites:favorites(count)
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (packsError) {
        console.error('Error fetching my packs:', packsError);
        setError(packsError.message);
        return;
      }

      // Get favorite counts using RPC
      const { data: favoriteCounts } = await supabase.rpc('get_favorite_counts');
      
      const favoriteCountMap = (favoriteCounts as { prompt_pack_id: string; count: number }[] || [])
        .reduce((acc: Record<string, number>, curr) => {
          acc[curr.prompt_pack_id] = curr.count;
          return acc;
        }, {});

      // Get user's favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('prompt_pack_id')
        .eq('user_id', user.id);

      const userFavorites = favoritesData?.map(f => f.prompt_pack_id) || [];

      // Get creator profiles
      const creatorIds = Array.from(new Set((packsData || []).map(pack => pack.creator_id)));
      const { data: creatorData } = await supabase
        .from('users')
        .select('id, full_name, username, avatar_url')
        .in('id', creatorIds);

      const creatorMap = new Map(
        creatorData?.map(creator => [creator.id, creator]) || []
      );

      // Transform the data
      const transformedData = (packsData || []).map(pack => {
        const creator = creatorMap.get(pack.creator_id);
        const validPreviewImages = Array.isArray(pack.preview_images)
          ? pack.preview_images.filter((url: string) => url && typeof url === 'string' && url.trim() !== '')
          : [];

        return {
          id: pack.id,
          title: pack.title,
          prompt: pack.prompt,
          full_prompt: pack.full_prompt,
          ai_model: pack.ai_model,
          category: pack.category,
          preview_images: validPreviewImages,
          creator_name: creator?.full_name || creator?.username || 'Anonymous',
          creator_avatar: creator?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.full_name || creator?.username || 'anonymous'}`,
          created_at: pack.created_at,
          updated_at: pack.updated_at,
          favorite_count: favoriteCountMap[pack.id] || 0,
          is_favorited: userFavorites.includes(pack.id)
        };
      });

      setMyPacks(transformedData);
    } catch (err) {
      console.error('Error in fetchMyPacks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prompt packs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedPacks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // First get the liked pack IDs
      const { data: likedIds, error: likedError } = await supabase
        .from('favorites')
        .select('prompt_pack_id')
        .eq('user_id', user.id);

      if (likedError) {
        console.error('Error fetching liked pack IDs:', likedError);
        setError(likedError.message);
        return;
      }

      if (likedIds.length === 0) {
        setLikedPacks([]);
        setIsLoading(false);
        return;
      }

      // Fetch the prompt packs with favorites count
      const { data: packsData, error: packsError } = await supabase
        .from('prompt_packs')
        .select(`
          *,
          favorites:favorites(count)
        `)
        .in('id', likedIds.map(row => row.prompt_pack_id))
        .order('created_at', { ascending: false });

      if (packsError) {
        console.error('Error fetching liked packs:', packsError);
        setError(packsError.message);
        return;
      }

      // Get favorite counts using RPC
      const { data: favoriteCounts } = await supabase.rpc('get_favorite_counts');
      
      const favoriteCountMap = (favoriteCounts as { prompt_pack_id: string; count: number }[] || [])
        .reduce((acc: Record<string, number>, curr) => {
          acc[curr.prompt_pack_id] = curr.count;
          return acc;
        }, {});

      // Get creator profiles
      const creatorIds = Array.from(new Set((packsData || []).map(pack => pack.creator_id)));
      const { data: creatorData } = await supabase
        .from('users')
        .select('id, full_name, username, avatar_url')
        .in('id', creatorIds);

      const creatorMap = new Map(
        creatorData?.map(creator => [creator.id, creator]) || []
      );

      // Transform the data
      const transformedData = (packsData || []).map(pack => {
        const creator = creatorMap.get(pack.creator_id);
        const validPreviewImages = Array.isArray(pack.preview_images)
          ? pack.preview_images.filter((url: string) => url && typeof url === 'string' && url.trim() !== '')
          : [];

        return {
          id: pack.id,
          title: pack.title,
          prompt: pack.prompt,
          full_prompt: pack.full_prompt,
          ai_model: pack.ai_model,
          category: pack.category,
          preview_images: validPreviewImages,
          creator_name: creator?.full_name || creator?.username || 'Anonymous',
          creator_avatar: creator?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.full_name || creator?.username || 'anonymous'}`,
          created_at: pack.created_at,
          updated_at: pack.updated_at,
          favorite_count: favoriteCountMap[pack.id] || 0,
          is_favorited: true // These are all favorited since they're in the liked packs
        };
      });

      setLikedPacks(transformedData);
    } catch (err) {
      console.error('Error in fetchLikedPacks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch liked packs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchMyPacks();
    } else {
      fetchLikedPacks();
    }
  }, [tabValue, user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditForm(profile);
    setAvatarPreview(profile?.avatar_url || null);
    setIsEditMode(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editForm) return;
    
    setError(null);
    setIsLoading(true);
    try {
      let avatarUrl = editForm.avatar_url;

      if (avatarFile) {
        if (avatarFile.size > 5 * 1024 * 1024) {
          throw new Error('Avatar image must be less than 5MB');
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(avatarFile.type)) {
          throw new Error('Avatar must be a JPEG, PNG, or GIF file');
        }

        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        if (profile?.avatar_url) {
          try {
            const oldFilePath = profile.avatar_url.split('/').pop();
            if (oldFilePath) {
              await supabase.storage
                .from('avatars')
                .remove([`${user.id}/${oldFilePath}`]);
            }
          } catch (error) {
            console.error('Error removing old avatar:', error);
          }
        }

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: avatarFile.type
          });

        if (uploadError) {
          throw new Error('Failed to upload avatar. Please try again.');
        }

        if (!data) {
          throw new Error('Failed to upload avatar. No data returned.');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error('Failed to update profile. Please try again.');
      }

      await refreshProfile();
      setIsEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm(null);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const renderEmptyState = (type: 'upload' | 'browse') => (
    <Box 
      sx={{ 
        textAlign: 'center', 
        py: 8,
        px: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {type === 'upload' ? 'No prompt packs uploaded yet' : 'No liked prompt packs yet'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {type === 'upload' 
          ? 'Start sharing your prompts with the community'
          : 'Discover and like amazing prompts from our creators'}
      </Typography>
      <Button
        variant="contained"
        startIcon={type === 'upload' ? <AddIcon /> : <SearchIcon />}
        onClick={() => navigate(type === 'upload' ? '/upload' : '/')}
      >
        {type === 'upload' ? 'Upload Prompt Pack' : 'Browse Prompts'}
      </Button>
    </Box>
  );

  const renderPromptGrid = (prompts: PromptPackDetails[]) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', p: 3 }}>
          {[1, 2, 3, 4].map((key) => (
            <Skeleton 
              key={key} 
              variant="rectangular" 
              data-testid="loading-skeleton"
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
          }
        }}
      >
        {prompts.map((prompt) => (
          <Box 
            key={prompt.id}
            sx={{ 
              height: 400,
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

  if (!user || !profile) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={isEditMode ? (avatarPreview || undefined) : (profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'anonymous'}`)}
              alt={profile?.username || user?.email}
              sx={{ width: 120, height: 120 }}
            />
            {isEditMode && (
              <Button
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  minWidth: 'auto',
                  p: 1,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <EditIcon fontSize="small" />
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleAvatarChange}
                />
              </Button>
            )}
          </Box>
          <Box sx={{ ml: 3, flexGrow: 1 }}>
            {isEditMode ? (
              <Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Display Name"
                  value={editForm?.full_name || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={editForm?.username || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, username: e.target.value } : null)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={editForm?.bio || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" gutterBottom sx={{ mb: 0, mr: 2 }}>
                    {profile.full_name || profile.username || user.email}
                  </Typography>
                  <IconButton onClick={handleEditClick} size="small">
                    <EditIcon />
                  </IconButton>
                </Box>
                {profile.username && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    @{profile.username}
                  </Typography>
                )}
                <Typography variant="body1">
                  {profile.bio || 'No bio provided'}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="My Prompt Packs" />
          <Tab label="Liked" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        {myPacks.length > 0 ? renderPromptGrid(myPacks) : renderEmptyState('upload')}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {likedPacks.length > 0 ? renderPromptGrid(likedPacks) : renderEmptyState('browse')}
      </TabPanel>
    </Container>
  );
};

export default Profile; 