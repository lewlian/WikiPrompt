import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export const AuthTest = () => {
  const { user, signIn, signUp, signOut, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setAuthError(null);
    const { error } = await signUp(email, password, name);
    if (error) {
      console.error('Error signing up:', error.message);
      setAuthError(error.message);
    }
  };

  const handleSignIn = async () => {
    setAuthError(null);
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Error signing in:', error.message);
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      setAuthError(error.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Auth Test</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      
      {authError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
      )}

      {user ? (
        <Box>
          <Typography sx={{ mb: 2 }}>Logged in as: {user.email}</Typography>
          <Button variant="contained" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Name (for signup)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" onClick={handleSignUp}>
            Sign Up
          </Button>
          <Button variant="outlined" onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      )}
    </Box>
  );
}; 