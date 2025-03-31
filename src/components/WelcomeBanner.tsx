import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

// Sample slogans that highlight the platform's value proposition
const SLOGANS = [
  {
    title: "Get your next",
    highlight: "breakthrough prompt idea",
    subtitle: "Discover and share AI prompts that actually work"
  },
  {
    title: "Unlock the power of",
    highlight: "AI conversations",
    subtitle: "Curated prompts from the world's best prompt engineers"
  },
  {
    title: "Transform your",
    highlight: "AI workflow",
    subtitle: "Premium prompt packs for every use case"
  },
  {
    title: "Build better with",
    highlight: "proven prompts",
    subtitle: "Save time with ready-to-use prompt templates"
  }
];

// Sample gallery images (replace with your actual AI-generated images)
const GALLERY_IMAGES = [
  [
    '/gallery/creative1.jpg',
    '/gallery/creative2.jpg',
    '/gallery/creative3.jpg',
    '/gallery/creative4.jpg'
  ],
  [
    '/gallery/business1.jpg',
    '/gallery/business2.jpg',
    '/gallery/business3.jpg',
    '/gallery/business4.jpg'
  ],
  [
    '/gallery/tech1.jpg',
    '/gallery/tech2.jpg',
    '/gallery/tech3.jpg',
    '/gallery/tech4.jpg'
  ],
  [
    '/gallery/art1.jpg',
    '/gallery/art2.jpg',
    '/gallery/art3.jpg',
    '/gallery/art4.jpg'
  ]
];

const WelcomeBanner: React.FC = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Rotate slogans every 5 seconds
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % SLOGANS.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentSlogan((prev) => (prev + 1) % SLOGANS.length);
  };

  const handlePrev = () => {
    setCurrentSlogan((prev) => (prev - 1 + SLOGANS.length) % SLOGANS.length);
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'rgba(30, 41, 59, 0.5)',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Text Content */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: 'center', md: 'left' },
              transition: 'opacity 0.5s ease-in-out',
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'white',
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              }}
            >
              {SLOGANS[currentSlogan].title}{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  display: 'inline',
                }}
              >
                {SLOGANS[currentSlogan].highlight}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              {SLOGANS[currentSlogan].subtitle}
            </Typography>
          </Box>

          {/* Gallery Grid */}
          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 2,
              maxWidth: { xs: '100%', md: '600px' },
            }}
          >
            {GALLERY_IMAGES[currentSlogan].map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: index % 3 === 0 ? '240px' : '180px',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}
              >
                <img
                  src={image}
                  alt={`Gallery item ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Navigation Arrows */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: 2,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 2,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <KeyboardArrowRight />
          </IconButton>

          {/* Dots Indicator */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            {SLOGANS.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentSlogan ? 'primary.main' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'background-color 0.3s ease-in-out',
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeBanner; 