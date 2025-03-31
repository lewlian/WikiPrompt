import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

// Essential footer links
const FOOTER_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Community', href: '/community' },
  { name: 'Contact', href: '/contact' },
];

// Social media links
const SOCIAL_LINKS = [
  { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com/wikiprompt' },
  { name: 'GitHub', icon: GitHubIcon, href: 'https://github.com/wikiprompt' },
  { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://linkedin.com/company/wikiprompt' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'rgba(30, 41, 59, 0.5)',
        color: 'white',
        py: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: 3,
        }}>
          {/* Logo and Description */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 2,
            maxWidth: '300px'
          }}>
            <Typography variant="h6">
              WikiPrompt
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: { xs: 'center', md: 'left' },
            }}>
              Discover and share the best AI prompts. Join our community of prompt engineers and AI enthusiasts.
            </Typography>
          </Box>

          {/* Links and Social Icons */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-end' },
            gap: 3
          }}>
            {/* Links */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 4 }}
              alignItems="center"
            >
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>

            {/* Social Icons */}
            <Stack 
              direction="row" 
              spacing={1}
              sx={{
                justifyContent: { xs: 'center', md: 'flex-end' },
                width: '100%'
              }}
            >
              {SOCIAL_LINKS.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" textAlign={{ xs: 'center', sm: 'left' }}>
            © {currentYear} WikiPrompt. All rights reserved.
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              '& a': {
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                '&:hover': {
                  color: 'white',
                },
              },
            }}
          >
            <Link href="/privacy" variant="body2">Privacy</Link>
            <Link href="/terms" variant="body2">Terms</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 