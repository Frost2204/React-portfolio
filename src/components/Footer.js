import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import DiscordIcon from './customStyle/discord.svg'; // Update the path based on where you saved the SVG

// Import the signature image
import signatureImage from './customStyle/nikunj.png'; // Update this path based on your project structure

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        padding: '20px',
        background: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', sm: 'row' },
        textAlign: { xs: 'center', sm: 'left' },
      }}
    >
      <hr className='bg-white' />
      <Box sx={{ flex: '0 0 auto', marginBottom: { xs: '20px', sm: '0' } }}>
        <img
          src={signatureImage}
          alt="Signature"
          style={{
            maxWidth: '150px',
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, textAlign: 'center', marginBottom: { xs: '20px', sm: '0' } }}>
        <Typography variant="body2" sx={{ marginBottom: '5px' }}>
          © 2024 My Portfolio. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '20px' }}>
          Follow me on 💛 social media
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: '5px' }}>
          Always open to networking and collaboration.😊 Feel free to reach out!❤️
        </Typography>
        <Typography variant="body2">
          <a href="mailto:nikunjranjan2204@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>
            nikunjranjan2204@gmail.com
          </a>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px',
          flexWrap: 'wrap',
          marginTop: { xs: '20px', sm: '0' },
        }}
      >
        <IconButton
          component="a"
          href="https://www.instagram.com/nikunj_ranjan_/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          sx={{
            color: '#fff',
            '&:hover svg': {
              filter: 'drop-shadow(0 0 10px #fff)',
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            },
          }}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://discord.gg/wEaP7eTcdU"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          sx={{
            color: '#fff',
            '&:hover img': {
              filter: 'drop-shadow(0 0 10px #fff)', // Adjust for the image
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            },
          }}
        >
          <img src={DiscordIcon} alt="Discord" style={{ width: '24px', height: '24px' }} /> {/* Use the custom SVG */}
        </IconButton>
        <IconButton
          component="a"
          href="https://www.linkedin.com/in/nikunj-ranjan-668696177/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          sx={{
            color: '#fff',
            '&:hover svg': {
              filter: 'drop-shadow(0 0 10px #fff)',
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            },
          }}
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://github.com/Frost2204"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          sx={{
            color: '#fff',
            '&:hover svg': {
              filter: 'drop-shadow(0 0 10px #fff)',
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease, filter 0.2s ease',
            },
          }}
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
