import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import visualVibeImage from './customStyle/about/VisualVibe.png'; // Replace with Visual Vibe image
import teamMember1 from './customStyle/about/p1.jpeg'; // Replace with actual team member images
import teamMember2 from './customStyle/about/p2.jpeg';
import teamMember3 from './customStyle/about/p3.jpeg';

// Styled Image with fixed size, curved border
const StyledImage = styled('img')(() => ({
  width: '100%', // Make image responsive
  height: '100%', // Fixed height for the image
  objectFit: 'cover', // Maintain aspect ratio without distortion
  borderRadius: '50%', // Rounded image
}));

// Styled image for VisualVibe
const VisualVibeImage = styled('img')(() => ({
  width: '100%', // Make image responsive
  height: 'auto', // Auto height to maintain aspect ratio
  borderRadius: '10px', // Rounded border for VisualVibe image
}));

// Container for the image to maintain 1:1 aspect ratio and center it
const ImageContainer = styled(Box)(() => ({
  width: '100px', // Default width for team member images
  height: '100px', // Default height for team member images
  margin: '0 auto', // Center the image
  overflow: 'hidden', // Ensure images are clipped to the container
  borderRadius: '50%', // Rounded container for profile images
  '@media (min-width:600px)': {
    width: '120px', // Increased width for desktop
    height: '120px', // Increased height for desktop
  },
  '@media (min-width:960px)': {
    width: '150px', // Further increased width for larger desktops
    height: '150px', // Further increased height for larger desktops
  },
}));

// Styled Vertical Glow Line
const GlowLine = styled(Box)(() => ({
  width: '2px',
  height: '100%', // Full height of the container
  background: 'linear-gradient(to bottom, #00ffcc, #ff00cc)', // Gradient for glowing effect
  boxShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #ff00cc', // Glowing effect
  margin: '0 16px', // Margin for spacing between sections
}));

const AboutMe = () => {
  return (
    <Box id="visualvibe" sx={{ padding: 4, borderRadius: '20px', backgroundColor: '#1A1A1A', width: '90%', margin: '20px auto' }}>
      {/* Title, Description and Image on the left and Team Profiles on the right */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'left' }}>
            VisualVibe
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1, color: '#cccccc' }}>
            We are a small team dedicated to creating 3D models, animations, and web pages. 🚀✨
          </Typography>
          <a href="https://www.instagram.com/visualvibe.in/" target="_blank" rel="noopener noreferrer">
            <VisualVibeImage src={visualVibeImage} alt="Visual Vibe" />
          </a>
        </Grid>
        
        {/* Vertical Glow Line */}
        <Grid item xs={12} sm={1} sx={{ display: { xs: 'none', sm: 'block' } }}> {/* Hide on extra-small screens */}
          <GlowLine />
        </Grid>
        
        {/* My Team Section on the right */}
        <Grid item xs={12} sm={5}>
          <Box sx={{ marginTop: 4 }}>
            <Grid container spacing={2}>
              {/* Team Member 1 */}
              <Grid item xs={6} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageContainer>
                  <StyledImage src={teamMember1} alt="Team Member 1" />
                </ImageContainer>
                <Typography variant="body2" sx={{ color: '#ffffff', marginTop: 1 }}>Nikunj Ranjan</Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Game & Web Developer</Typography>
              </Grid>
              {/* Team Member 2 */}
              <Grid item xs={6} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageContainer>
                  <StyledImage src={teamMember2} alt="Team Member 2" />
                </ImageContainer>
                <Typography variant="body2" sx={{ color: '#ffffff', marginTop: 1 }}>Pradhan Ji</Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Video Editor & UI/UX</Typography>
              </Grid>
              {/* Team Member 3 */}
              <Grid item xs={6} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageContainer>
                  <StyledImage src={teamMember3} alt="Team Member 3" />
                </ImageContainer>
                <Typography variant="body2" sx={{ color: '#ffffff', marginTop: 1 }}>Romuedeep Das</Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>Web Developer</Typography>
              </Grid>
              {/* Team Member 4 */}
              {/* <Grid item xs={6} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageContainer>
                  <StyledImage src={teamMember4} alt="Team Member 4" />
                </ImageContainer>
                <Typography variant="body2" sx={{ color: '#ffffff', marginTop: 1 }}>Krishnavi Arsh</Typography>
                <Typography variant="body2" sx={{ color: '#cccccc' }}>UI/UX Designer</Typography>
              </Grid> */}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutMe;
