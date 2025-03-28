import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    navigate(`/auth?mode=${mode}`);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 0, mr: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          WikiPrompt
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search prompts..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <>
            {user.user_metadata.type === 'creator' && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleUploadClick}
                sx={{ mr: 2 }}
              >
                Upload Prompt
              </Button>
            )}
            <Button onClick={handleSignOut}>Sign Out</Button>
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