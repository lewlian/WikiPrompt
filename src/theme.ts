import { createTheme } from '@mui/material';

// Define custom colors
const colors = {
  primary: {
    main: '#3B82F6', // Bright blue
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0F172A', // Dark blue-gray
    paper: '#1E293B',
    darker: '#0F172A',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
  },
  divider: 'rgba(148, 163, 184, 0.12)',
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    ...colors,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Space Grotesk", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(135deg, ${colors.background.darker} 0%, ${colors.background.paper} 100%)`,
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 50%)',
            pointerEvents: 'none',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1), transparent 50%)',
            pointerEvents: 'none',
            zIndex: 1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          },
        },
        outlined: {
          borderColor: '#3B82F6',
          '&:hover': {
            borderColor: '#60A5FA',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.background.paper} 0%, rgba(30, 41, 59, 0.8) 100%)`,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            background: `linear-gradient(135deg, ${colors.background.paper} 0%, rgba(30, 41, 59, 0.9) 100%)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          '&.MuiChip-filled': {
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(148, 163, 184, 0.05)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(148, 163, 184, 0.15)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(to right, ${colors.background.paper} 0%, rgba(30, 41, 59, 0.98) 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.3), transparent)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.background.paper} 0%, rgba(30, 41, 59, 0.8) 100%)`,
          backdropFilter: 'blur(10px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
          },
        },
      },
    },
  },
});

export default theme; 