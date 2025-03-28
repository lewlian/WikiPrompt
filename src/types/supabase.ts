export interface CreatorProfile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  social_links: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  stats: {
    followers: number;
    total_sales: number;
  };
}

export interface PromptPack {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  ai_model: string;
  creator_id: string;
  preview_images: string[];
  full_prompt: string;
  preview_prompt: string;
  metadata: {
    style: string;
    complexity: string;
    recommended_settings: {
      aspect_ratio: string;
      quality: number;
    };
  };
  created_at: string;
}

export interface PromptPackDetails extends PromptPack {
  creator_name: string;
  creator_avatar: string;
  favorite_count: number;
  purchase_count: number;
} 