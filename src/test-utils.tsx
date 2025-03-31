import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';

// Create a theme instance
const theme = createTheme();

// Mock Supabase client
const mockPrompt = {
  id: 'test-id',
  title: 'Test Prompt',
  prompt: 'This is a test prompt',
  full_prompt: 'This is the full test prompt',
  ai_model: 'GPT-4',
  category: 'Test Category',
  price: 0,
  preview_images: ['https://example.com/image1.jpg'],
  creator_name: 'Test Creator',
  creator_avatar: 'https://example.com/avatar.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  favorite_count: 5,
  is_favorited: false,
  has_purchased: false,
};

const mockQuery = {
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockPrompt, error: null }),
  execute: jest.fn().mockResolvedValue({ data: [mockPrompt], error: null }),
  delete: jest.fn().mockResolvedValue({ error: null }),
  insert: jest.fn().mockResolvedValue({ error: null }),
};

const mockFrom = jest.fn().mockReturnValue(mockQuery);

const mockAuth = {
  getSession: jest.fn().mockResolvedValue({ 
    data: { 
      session: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        }
      }
    }, 
    error: null 
  }),
  signInWithPassword: jest.fn().mockResolvedValue({ 
    data: { 
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      }
    }, 
    error: null 
  }),
  signUp: jest.fn().mockResolvedValue({ 
    data: { 
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      }
    }, 
    error: null 
  }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  onAuthStateChange: jest.fn().mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  }),
};

export const mockSupabase = {
  from: mockFrom,
  auth: mockAuth,
  rpc: jest.fn().mockResolvedValue({
    data: [{ prompt_pack_id: 'test-id', count: 5 }],
    error: null,
  }),
};

// Mock the Supabase client module
jest.mock('./lib/supabaseClient', () => ({
  __esModule: true,
  default: mockSupabase,
  supabase: mockSupabase,
}));

interface RenderOptions {
  route?: string;
  withoutRouter?: boolean;
}

function render(ui: React.ReactElement, { route = '/', withoutRouter = false }: RenderOptions = {}) {
  window.history.pushState({}, 'Test page', route);
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {withoutRouter ? children : <BrowserRouter>{children}</BrowserRouter>}
      </AuthProvider>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 