import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Skeleton,
} from '@mui/material';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import PromptCard from './PromptCard';

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
  favorite_count: number;
  is_favorited?: boolean;
  has_purchased?: boolean;
}

interface FavoriteCount {
  prompt_pack_id: string;
  count: number;
}

interface PromptGridProps {
  categories: string[];
  aiModel: string;
  sortBy: string;
  searchQuery: string;
}

const PromptGrid: React.FC<PromptGridProps> = ({
  categories,
  aiModel,
  sortBy,
  searchQuery,
}) => {
  const { user } = useAuth();
  const [promptPacks, setPromptPacks] = useState<PromptPackDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('prompt_packs')
        .select(`
          *,
          favorites:favorites(count)
        `);

      // Apply category filter if needed (skip if "All" is selected)
      if (categories.length > 0 && !categories.includes('All')) {
        query = query.in('category', categories);
      }

      // Apply AI model filter if not "All"
      if (aiModel !== 'All') {
        query = query.eq('ai_model', aiModel);
      }

      // Apply search filter if provided
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          // Sort by favorites count
          query = query.order('favorites', { ascending: false, foreignTable: 'favorites' });
          break;
        case 'newest':
        default:
          // Sort by creation date
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data: promptData, error: promptError } = await query;

      if (promptError) {
        console.error('Error fetching prompts:', promptError);
        setError(promptError instanceof Error ? promptError.message : 'Failed to fetch prompts');
        return;
      }

      // Get favorite counts for all prompt packs using RPC
      const { data: favoriteCounts } = await supabase
        .rpc('get_favorite_counts');
      
      console.log('Raw favorite counts from Supabase:', favoriteCounts);

      interface FavoriteCount {
        prompt_pack_id: string;
        count: number;
      }

      const favoriteCountMap = (favoriteCounts as FavoriteCount[] || []).reduce((acc: Record<string, number>, curr: FavoriteCount) => {
        acc[curr.prompt_pack_id] = curr.count;
        return acc;
      }, {});
      
      console.log('Transformed favorite count map:', favoriteCountMap);

      // Get user's favorites if logged in
      let userFavorites: string[] = [];
      if (user) {
        const { data: favoritesData } = await supabase
          .from('favorites')
          .select('prompt_pack_id')
          .eq('user_id', user.id);
        userFavorites = favoritesData?.map(f => f.prompt_pack_id) || [];
        console.log('User favorites:', userFavorites);
      }

      // Get user's purchases if logged in
      let userPurchases: string[] = [];
      if (user) {
        const { data: purchasesData } = await supabase
          .from('purchases')
          .select('prompt_pack_id')
          .eq('user_id', user.id);
        userPurchases = purchasesData?.map(p => p.prompt_pack_id) || [];
        console.log('User purchases:', userPurchases);
      }

      // Get creator profiles in a separate query
      const creatorIds = Array.from(new Set((promptData || []).map(pack => pack.creator_id)));
      const { data: creatorData } = await supabase
        .from('users')
        .select('id, full_name, username, avatar_url')
        .in('id', creatorIds);

      // Create a map of creator profiles
      const creatorMap = new Map(
        creatorData?.map(creator => [creator.id, creator]) || []
      );

      // Transform data to match PromptPackDetails interface
      const transformedData: PromptPackDetails[] = (promptData || []).map((pack: any) => {
        const creator = creatorMap.get(pack.creator_id);
        // Ensure we have valid preview images
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
          price: pack.price || 0,
          preview_images: validPreviewImages,
          creator_name: creator?.full_name || creator?.username || 'Anonymous',
          creator_avatar: creator?.avatar_url || 
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.full_name || creator?.username || 'anonymous'}`,
          created_at: pack.created_at,
          updated_at: pack.updated_at,
          favorite_count: favoriteCountMap[pack.id] || 0,
          is_favorited: userFavorites.includes(pack.id),
          has_purchased: userPurchases.includes(pack.id),
        };
      });

      setPromptPacks(transformedData);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [categories, aiModel, sortBy, searchQuery, user]);

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
        },
        p: 3,
      }}
    >
      {promptPacks.map((prompt) => (
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

export default PromptGrid; 