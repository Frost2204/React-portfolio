import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import profileImage from './customStyle/about/p.jpeg'; // Use the new image path if needed

// Styled Image with fixed size, curved border, and 1:1 aspect ratio
const StyledImage = styled('img')(() => ({
  width: '100%', // Make image responsive
  height: '100%', // Fixed height for the image
  objectFit: 'cover', // Maintain aspect ratio without distortion
  borderRadius: '15px', // Curved border
}));

// Container for the image to maintain 1:1 aspect ratio and center it
const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%', // Full width
  height: '0', // Set height to 0 to use padding for aspect ratio
  paddingBottom: '100%', // 1:1 aspect ratio
  position: 'relative', // For absolute positioning of the image
  overflow: 'hidden', // Hide overflow
  display: 'flex', // Use flexbox to center the image
  alignItems: 'center', // Center vertically
  justifyContent: 'center', // Center horizontally
  [theme.breakpoints.up('sm')]: { // Adjust for larger screens
    width: '50%', // 50% width for smaller container on desktop
    paddingBottom: '50%', // Maintain square aspect ratio
  },
}));

// Glowing line style
const GlowingLine = styled(Box)(() => ({
  height: '2px',
  backgroundColor: 'white',
  boxShadow: '0 0 10px white', // Glowing effect
  margin: '16px 0', // Space above and below the line
}));

const AboutMe = () => {
  return (
    <Box id="about" sx={{ padding: 4, borderRadius: '20px', backgroundColor: '#1A1A1A', width: '90%', margin: '0 auto' }}>
      <Grid container spacing={4}>
        {/* Left Side: Static Image */}
        <Grid item xs={12} sm={6} sx={{ paddingRight: { xs: 0, sm: 2 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ImageContainer>
            <StyledImage src={profileImage} alt="Profile" style={{ position: 'absolute', top: 0, left: 0 }} />
          </ImageContainer>
        </Grid>

        {/* Right Side: Personal Information */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Nikunj Ranjan
          </Typography>
          <GlowingLine />
          <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#ffffff' }}>
            Asansol Engineering College {/* Replace with your actual college name */}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#cccccc', marginTop: 1 }}>
            B.Tech in Information Technology
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2, color: '#cccccc' }}>
            2020 - 2024
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'normal', color: '#cccccc' }}>
            Web Developer & Blender Artist
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2, color: '#cccccc' }}>
          Proficient in front-end web development (HTML, Java, JavaScript, CSS) with expertise in Unreal Engine
          for creating immersive games and Blender for crafting 3D animations and graphics.          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutMe;
