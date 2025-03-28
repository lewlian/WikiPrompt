export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatarUrl: string;
          type: 'creator' | 'user';
          following: string[];
          purchasedPacks: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatarUrl?: string;
          type?: 'creator' | 'user';
          following?: string[];
          purchasedPacks?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatarUrl?: string;
          type?: 'creator' | 'user';
          following?: string[];
          purchasedPacks?: string[];
          updated_at?: string;
        };
      };
    };
  };
} 