import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Container,
  Tab,
  Tabs,
} from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(searchParams.get('mode') === 'signup' ? 1 : 0);

  const handleSignUp = async () => {
    setError(null);
    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error.message);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleSignIn = async () => {
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleTabChange = (newValue: number) => {
    setTab(newValue);
    const mode = newValue === 1 ? 'signup' : 'signin';
    navigate(`/auth?mode=${mode}`, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to WikiPrompt
        </Typography>

        {(error || authError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || (authError as Error)?.message}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}; 