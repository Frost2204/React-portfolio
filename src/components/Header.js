import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './customStyle/nikunj.png'; // Adjust the path based on where your image is located
import skillsIcon from './customStyle/VV.png'; // New image for the Skills link
import Contact from './Contact'; // Import the new Contact component

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false); // State for opening Contact dialog

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling effect
    });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setDrawerOpen(false); // Close the drawer if it’s open
    }
  };

  const handleContactClick = () => {
    setContactOpen(true); // Open the Contact dialog
    setDrawerOpen(false); // Close the drawer if it’s open
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        bgcolor: 'black',
        color: 'white',
        padding: '16px', // Add padding to the drawer for better appearance
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Skills', 'Projects', 'About', 'Contact'].map((label) => (
          <ListItem
            button
            key={label}
            onClick={
              label === 'Contact'
                ? handleContactClick
                : () => scrollToSection(label.toLowerCase()) // Scroll to respective section
            }
            sx={{ marginBottom: '20px' }} // Increase spacing between buttons
          >
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                style: { color: 'white', textShadow: '0px 0px 5px #ffffff' },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          className="bg-black"
        >
          {/* Logo image with scroll-to-top onClick */}
          <img
            src={logo}
            alt="My Portfolio"
            style={{
              height: '50px',
              marginRight: '16px',
              cursor: 'pointer',
              transition: 'filter 0.3s ease', // Add transition for smooth glow effect
            }}
            onClick={handleLogoClick} // Scroll to the top on click
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px white)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
          />

          {/* Skills icon for mobile view */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            <a
              href="#visualvibe"
              style={{ textDecoration: 'none' }}
            >
              <img
                src={skillsIcon}
                alt="Skills Icon"
                style={{
                  height: '30px',
                  marginRight: '8px',
                  borderRadius: '50%',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px white)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
              />
            </a>
            {/* Line to the left of Skills */}
            <Box
              sx={{
                borderLeft: '2px solid white',
                height: '40px',
                marginRight: '16px',
                boxShadow: '0px 0px 5px 2px rgba(255, 255, 255, 0.6)', // White shadow effect on the line
              }}
            />
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <React.Fragment>
              {/* Add the image and line to the left of Skills */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Skills icon with hover effect and new tab link */}
                <a
                  href="#visualvibe"
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={skillsIcon}
                    alt="Skills Icon"
                    style={{
                      height: '30px',
                      marginRight: '8px',
                      borderRadius: '50%',
                      transition: 'filter 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'drop-shadow(0 0 10px white)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                  />
                </a>

                {/* Line to the left of Skills */}
                <Box
                  sx={{
                    borderLeft: '2px solid white',
                    height: '40px',
                    marginRight: '16px',
                    boxShadow: '0px 0px 5px 2px rgba(255, 255, 255, 0.6)', // White shadow effect on the line
                  }}
                />
              </Box>

              <Button
                color="inherit"
                sx={{
                  margin: '0 8px',
                  position: 'relative',
                  transition: 'text-shadow 0.3s ease', // Apply transition to text-shadow
                  textShadow: '0px 0px 5px #ffffff', // Default text shadow for buttons
                  '&:hover': {
                    textShadow: '0px 0px 15px #ffffff, 0px 0px 20px #ffffff, 0px 0px 25px #ffffff', // Increased glow intensity on hover
                    boxShadow: 'none',
                  },
                  '&:active': {
                    transform: 'scale(0.95)', // Slight scale effect when clicked
                  },
                }}
                onClick={() => scrollToSection('skills')} // Scroll to Skills section
              >
                Skills
              </Button>
            </React.Fragment>

            {/* Other buttons: Projects, About, Contact */}
            {['Projects', 'About', 'Contact'].map((label) => (
              <Button
                key={label}
                color="inherit"
                sx={{
                  margin: '0 8px',
                  position: 'relative',
                  transition: 'text-shadow 0.3s ease',
                  textShadow: '0px 0px 5px #ffffff',
                  '&:hover': {
                    textShadow: '0px 0px 15px #ffffff, 0px 0px 20px #ffffff, 0px 0px 25px #ffffff',
                    boxShadow: 'none',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
                onClick={
                  label === 'Contact' ? handleContactClick : () => scrollToSection(label.toLowerCase()) // Scroll to respective section
                }
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>

      <Contact open={contactOpen} onClose={() => setContactOpen(false)} /> {/* Render Contact component */}
    </>
  );
};

export default Header;
