import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { useUserProfile } from '../hooks/useUserProfile';

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

interface PromptPack {
  id: string;
  title: string;
  preview_images: string[];
  category: string;
  price: number;
  favorite_count: number;
  creator_name: string;
  creator_avatar_url: string | null;
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [myPacks, setMyPacks] = useState<PromptPack[]>([]);
  const [collectedPacks, setCollectedPacks] = useState<PromptPack[]>([]);
  const [likedPacks, setLikedPacks] = useState<PromptPack[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile, refreshProfile } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPacks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('prompt_pack_details')
        .select('*')
        .eq('creator_id', user.id);

      if (data && !error) {
        setMyPacks(data);
      }
    };

    const fetchCollectedPacks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_user_purchased_packs');

      if (data && !error) {
        setCollectedPacks(data);
      }
    };

    const fetchLikedPacks = async () => {
      if (!user) return;

      // First get the liked pack IDs
      const { data: likedIds, error: likedError } = await supabase
        .from('favorites')
        .select('prompt_pack_id')
        .eq('user_id', user.id);

      if (likedError || !likedIds) return;

      // Then fetch the pack details
      const { data, error } = await supabase
        .from('prompt_pack_details')
        .select('*')
        .in('id', likedIds.map(row => row.prompt_pack_id));

      if (data && !error) {
        setLikedPacks(data);
      }
    };

    fetchMyPacks();
    fetchCollectedPacks();
    fetchLikedPacks();
  }, [user]);

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

      // Upload new avatar if selected
      if (avatarFile) {
        // Validate file size (max 5MB)
        if (avatarFile.size > 5 * 1024 * 1024) {
          throw new Error('Avatar image must be less than 5MB');
        }

        // Validate file type
        const fileType = avatarFile.type;
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(fileType)) {
          throw new Error('Avatar must be a JPEG, PNG, or GIF file');
        }

        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // First, try to delete the old avatar if it exists
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
            // Continue with upload even if delete fails
          }
        }

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: fileType
          });

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
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

      // Update user profile
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
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile. Please try again.');
      }

      // Refresh the profile data
      await refreshProfile();

      setIsEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while updating profile');
      // Don't exit edit mode on error
      return;
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

  const renderPromptCard = (pack: PromptPack) => (
    <Box 
      key={pack.id} 
      sx={{ 
        width: { 
          xs: '100%', 
          sm: '50%', 
          md: '33.333%' 
        }, 
        p: 1 
      }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer'
        }}
        onClick={() => navigate(`/prompt/${pack.id}`)}
      >
        <CardMedia
          component="img"
          height="200"
          image={pack.preview_images[0] || 'https://placehold.co/400x400/e0e0e0/9e9e9e?text=No+Preview'}
          alt={pack.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {pack.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={pack.creator_avatar_url || undefined}
              alt={pack.creator_name}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {pack.creator_name}
            </Typography>
          </Box>
          <Chip 
            label={pack.category} 
            size="small" 
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`$${pack.price.toFixed(2)}`}
            size="small"
          />
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {pack.favorite_count}
            </Typography>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );

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
        {type === 'upload' ? 'No prompt packs uploaded yet' : 'No prompt packs found'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {type === 'upload' 
          ? 'Start sharing your prompts with the community'
          : 'Discover amazing prompts from our creators'}
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
          <Tab label="Collected" />
          <Tab label="Liked" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {myPacks.length > 0 ? (
          <Grid container spacing={3}>
            {myPacks.map(renderPromptCard)}
          </Grid>
        ) : renderEmptyState('upload')}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {collectedPacks.length > 0 ? (
          <Grid container spacing={3}>
            {collectedPacks.map(renderPromptCard)}
          </Grid>
        ) : renderEmptyState('browse')}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {likedPacks.length > 0 ? (
          <Grid container spacing={3}>
            {likedPacks.map(renderPromptCard)}
          </Grid>
        ) : renderEmptyState('browse')}
      </TabPanel>
    </Container>
  );
};

export default Profile; 