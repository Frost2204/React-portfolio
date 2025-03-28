import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import profileImage from './customStyle/about/G1.jpeg'; // Ensure the image path is correct
import { motion } from 'framer-motion';

// Styled Image with fixed size, curved border, and 1:1 aspect ratio
const StyledImage = styled('img')(() => ({
  width: '100%', // Make image responsive
  height: '100%', // Fixed height for the image
  objectFit: 'contain', // Ensure the entire image fits without cropping
  borderRadius: '15px', // Curved border for the image
}));

// Container for the image to maintain 1:1 aspect ratio and center it
const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%', // Full width
  height: '300px', // Fixed height for the image
  position: 'relative', // For absolute positioning of the image
  overflow: 'hidden', // Hide overflow (border radius will apply to the image)
  display: 'flex', // Use flexbox to center the image
  alignItems: 'center', // Center vertically
  justifyContent: 'center', // Center horizontally
  borderRadius: '15px', // Border radius for the container (same as image)
}));

// Glowing line style
const GlowingLine = styled(Box)(() => ({
  height: '2px',
  backgroundColor: 'white',
  boxShadow: '0 0 10px white', // Glowing effect
  margin: '16px 0', // Space above and below the line
}));

const AboutMe = () => {
  const textRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false); // Trigger animation out when moving out of view
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <Box
      id="about"
      sx={{
        padding: 4,
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
        backdropFilter: 'blur(10px)', // Apply blur effect for glassmorphism
        width: '90%',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add subtle shadow for better contrast
        border: '1px solid rgba(255, 255, 255, 0.2)', // Optional: Add border for visual distinction
      }}
    >
      <Grid container spacing={4}>
        {/* Left Side: Static Image */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            paddingRight: { xs: 0, sm: 2 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImageContainer>
            <StyledImage
              src={profileImage} // Ensure this is the correct path
              alt="Profile"
            />
          </ImageContainer>
        </Grid>

        {/* Right Side: Personal Information */}
        <Grid item xs={12} sm={6}>
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -100 }} // Start from left
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -100 }}
            exit={{ opacity: 0, x: -100 }} // Exit animation (move out)
            transition={{ duration: 1, type: 'spring', stiffness: 100 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              Nikunj Ranjan
            </Typography>
            <GlowingLine />
            <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#ffffff' }}>
              Game Developer {/* Replace with your actual college name */}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#cccccc', marginTop: 1 }}>
              B.Tech in Information Technology
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2, color: '#cccccc' }}>
              2020 - 2024
            </Typography>
            <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'Bold', color: '#cccccc' }}>
              Game Developer | Web Developer | Unity | Unreal Engine | Blender
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2, color: '#cccccc' }}>
            I'm Nikunj, a passionate game developer and web developer with experience in Unity, Unreal Engine, and front-end technologies. I love creating immersive gameplay experiences and experimenting with AI in games. Currently, I'm working on projects like a 2D platformer and a sci-fi runner while continuously learning and refining my skills. 🚀🎮
            </Typography>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutMe;
