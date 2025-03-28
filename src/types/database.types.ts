export interface Database {
  public: {
    Tables: {
      prompt_packs: {
        Row: {
          id: string;
          title: string;
          prompt: string;
          full_prompt: string;
          preview_images: string[];
          ai_model: string;
          category: string;
          price: number;
          creator_id: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          prompt: string;
          full_prompt: string;
          preview_images?: string[];
          ai_model: string;
          category: string;
          price: number;
          creator_id: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          prompt?: string;
          full_prompt?: string;
          preview_images?: string[];
          ai_model?: string;
          category?: string;
          price?: number;
          creator_id?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      creator_profiles: {
        Row: {
          id: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_user_purchased: {
        Args: { pack_id: string };
        Returns: boolean;
      };
      has_user_favorited: {
        Args: { pack_id: string };
        Returns: boolean;
      };
    };
  };
}
