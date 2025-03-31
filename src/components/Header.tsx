import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileMenu from './ProfileMenu';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    navigate(`/auth?mode=${mode}`);
  };

  const isHomePage = location.pathname === '/';

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={1}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper'
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 0, mr: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          WikiPrompt
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleUploadClick}
              sx={{ mr: 2 }}
            >
              Upload
            </Button>
            <ProfileMenu />
          </>
        ) : (
          <>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handleAuthClick('signup')}
              sx={{ mr: 2 }}
            >
              Become a Creator
            </Button>
            <Button onClick={() => handleAuthClick('signin')}>
              Sign In
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 