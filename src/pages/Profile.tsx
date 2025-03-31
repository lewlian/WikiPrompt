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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myPacks, setMyPacks] = useState<PromptPack[]>([]);
  const [collectedPacks, setCollectedPacks] = useState<PromptPack[]>([]);
  const [likedPacks, setLikedPacks] = useState<PromptPack[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, username, bio, full_name')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setProfile(data);
      }
    };

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

    fetchProfile();
    fetchMyPacks();
    fetchCollectedPacks();
    fetchLikedPacks();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderPromptCard = (pack: PromptPack) => (
    <Grid item xs={12} sm={6} md={4} key={pack.id}>
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
    </Grid>
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
          <Avatar
            src={profile.avatar_url || undefined}
            alt={profile.username || user.email}
            sx={{ width: 120, height: 120, mr: 4 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {profile.full_name || profile.username || user.email}
            </Typography>
            {profile.username && (
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                @{profile.username}
              </Typography>
            )}
            <Typography variant="body1">
              {profile.bio || 'No bio provided'}
            </Typography>
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