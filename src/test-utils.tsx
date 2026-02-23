import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';

// Jest automatically uses src/lib/__mocks__/supabaseClient.ts
// Re-export the mock for tests that need direct access
export { supabase as mockSupabase } from './lib/supabaseClient';

const theme = createTheme();

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
