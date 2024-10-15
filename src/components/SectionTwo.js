import React from 'react';
import { Button, Box, Grid, Typography } from '@mui/material';
import skillImage from './customStyle/laptop.jpg'; // Ensure this path is correct for your uploaded image
import { styled } from '@mui/material/styles';

// Custom styled button
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '8px 16px',
  textTransform: 'none', // Prevents uppercase transformation
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px', // Space between icon and text
  backgroundColor: '#151515', // Set button color to gray
  '&:hover': {
    backgroundColor: '#90A4AE', // Darker gray on hover
  },
}));

const SectionTwo = () => {
  return (
    <Box id="skills"
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: 4, 
        maxWidth: { xs: '100%', sm: '95%' }, // 100% on mobile, 95% on larger screens
        margin: '0 auto', // Center the box
      }}
    >
      <Grid container spacing={4} alignItems="center"> {/* Align items vertically center */}
        {/* Left Side Image */}
        <Grid item xs={12} sm={6} textAlign="center">
          <Box 
            sx={{
              borderRadius: '20px', // Set border radius here
              overflow: 'hidden', // Ensure the image respects the border radius
              display: 'flex', // Use flexbox for centering
              justifyContent: 'center', // Center the image horizontally
              alignItems: 'center', // Center the image vertically
              maxHeight: '300px', // Limit the maximum height of the image container
              padding: 2, // Add padding for spacing
            }}
          >
            <img
              src={skillImage}
              alt="Skills"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px', // Ensure image has rounded corners
                objectFit: 'cover', // Ensures the whole image is visible without distortion
              }}
            />
          </Box>
        </Grid>

        {/* Right Side Skills */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '50px', color: '#fffff' }}>
            Hi, I'm Nikunj Ranjan
          </Typography>
          <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'normal', fontSize: '1.25rem', color: '#cccccc' }}>
            Web & Game Developer, passionate about crafting interactive experiences. Creating innovative websites and immersive gaming worlds. Constantly learning and growing.
          </Typography>
          
          {/* Skill Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap', // Allows buttons to wrap to the next line
              gap: 2, // Space between buttons
              marginTop: 3,
            }}
          >
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="java">☕</span>}>
              Blender
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="html">🌐</span>}>
              HTML
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="css">🎨</span>}>
              CSS
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="javascript">💻</span>}>
              Java Script
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="unreal">🎮</span>}>
              Unreal Engine
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="blender">🖥️</span>}>
              Java
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="react">⚛️</span>}>
              React js
            </StyledButton>
            {/* Add more buttons as needed */}
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="python">🐍</span>}>
              Unity
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="nodejs">🌳</span>}>
              Node.js
            </StyledButton>
            <StyledButton variant="contained" startIcon={<span role="img" aria-label="typescript">🔷</span>}>
              TypeScript
            </StyledButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionTwo;
