import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import visualVibeImage from "./customStyle/about/VisualVibe.png"; // Replace with Visual Vibe image
import teamMember1 from "./customStyle/about/p1.jpeg"; // Replace with actual team member images
import teamMember2 from "./customStyle/about/p2.jpeg";
import teamMember3 from "./customStyle/about/p3.jpeg";

// Fade In from Right to Left (for images)
const fadeInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Fade In from Left to Right (for text)
const fadeInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Fade Out from Left to Right (for text)
const fadeOutFromLeft = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100px);
  }
`;

// Styled Image with fixed size, curved border
const StyledImage = styled("img")(() => ({
  width: "100%", // Make image responsive
  height: "100%", // Fixed height for the image
  objectFit: "cover", // Maintain aspect ratio without distortion
  borderRadius: "50%", // Rounded image
}));

// Styled image for VisualVibe
const VisualVibeImage = styled("img")(() => ({
  width: "100%", // Make image responsive
  height: "auto", // Auto height to maintain aspect ratio
  borderRadius: "10px", // Rounded border for VisualVibe image
}));

// Container for the image to maintain 1:1 aspect ratio and center it
const ImageContainer = styled(Box)(() => ({
  width: "100px", // Default width for team member images
  height: "100px", // Default height for team member images
  margin: "0 auto", // Center the image
  overflow: "hidden", // Ensure images are clipped to the container
  borderRadius: "50%", // Rounded container for profile images
  "@media (min-width:600px)": {
    width: "120px", // Increased width for desktop
    height: "120px", // Increased height for desktop
  },
  "@media (min-width:960px)": {
    width: "150px", // Further increased width for larger desktops
    height: "150px", // Further increased height for larger desktops
  },
}));

// Styled Vertical Glow Line
const GlowLine = styled(Box)(() => ({
  width: "2px",
  height: "100%", // Full height of the container
  background: "linear-gradient(to bottom, #00ffcc, #ff00cc)", // Gradient for glowing effect
  boxShadow: "0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #ff00cc", // Glowing effect
  margin: "0 16px", // Margin for spacing between sections
}));

// Fade In / Fade Out Hook
const useFadeInOnScroll = () => {
  const [isVisible, setIsVisible] = useState(false);

  const observer = useRef(
    new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Trigger when 50% of the element is in view
    )
  );

  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      observer.current.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current) {
        observer.current.unobserve(elementRef.current);
      }
    };
  }, []);

  return { isVisible, elementRef };
};

// Glassmorphism background style for the main container
const GlassmorphismContainer = styled(Box)(() => ({
  padding: "4rem",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.1)", // Slightly transparent background
  backdropFilter: "blur(10px)", // Blur effect
  width: "90%",
  margin: "20px auto",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for the glass effect
}));

const AboutMe = () => {
  // Use the custom hook for each team member and text
  const { isVisible: isVisualVibeVisible, elementRef: visualVibeRef } =
    useFadeInOnScroll();
  const { isVisible: isTeamMembersVisible, elementRef: teamMembersRef } =
    useFadeInOnScroll();

  return (
    <GlassmorphismContainer id="visualvibe">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} ref={visualVibeRef}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "left",
              opacity: isVisualVibeVisible ? 1 : 0, // Fade in effect for title
              transform: isVisualVibeVisible ? "none" : "translateX(-50px)", // Slide in from left
              transition: "all 1s ease-out",
            }}
          >
            VisualVibe
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginTop: 1,
              color: "#cccccc",
              opacity: isVisualVibeVisible ? 1 : 0, // Fade in effect for text
              transform: isVisualVibeVisible ? "none" : "translateX(-50px)",
              transition: "all 1s ease-out",
            }}
          >
            Freelance Work
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginTop: 1,
              color: "#cccccc",
              opacity: isVisualVibeVisible ? 1 : 0, // Fade in effect for text
              transform: isVisualVibeVisible ? "none" : "translateX(-50px)",
              transition: "all 1s ease-out",
            }}
          >
            We are a small team dedicated to creating 3D models, animations, and
            web pages. 🚀✨
          </Typography>
          <a
            href="https://www.instagram.com/visualivibe/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VisualVibeImage src={visualVibeImage} alt="Visual Vibe" />
          </a>
        </Grid>

        <Grid item xs={12} sm={1} sx={{ display: { xs: "none", sm: "block" } }}>
          <GlowLine />
        </Grid>

        <Grid item xs={12} sm={5} ref={teamMembersRef}>
          <Box sx={{ marginTop: 4 }}>
            <Grid container spacing={2}>
              {/* Team Member 1 */}
              <Grid
                item
                xs={6}
                sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    animation: `${fadeInFromRight} 1s ease-in-out forwards`,
                    opacity: isTeamMembersVisible ? 1 : 0,
                    transform: isTeamMembersVisible
                      ? "none"
                      : "translateX(50px)",
                    transition: "all 1s ease-out",
                  }}
                >
                  <ImageContainer>
                    <StyledImage src={teamMember1} alt="Team Member 1" />
                  </ImageContainer>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    marginTop: 1,
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Nikunj Ranjan
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#cccccc",
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Game & Web Developer
                </Typography>
              </Grid>

              {/* Team Member 2 */}
              <Grid
                item
                xs={6}
                sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    animation: `${fadeInFromRight} 1s ease-in-out forwards`,
                    opacity: isTeamMembersVisible ? 1 : 0,
                    transform: isTeamMembersVisible
                      ? "none"
                      : "translateX(50px)",
                    transition: "all 1s ease-out",
                  }}
                >
                  <ImageContainer>
                    <StyledImage src={teamMember2} alt="Team Member 2" />
                  </ImageContainer>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    marginTop: 1,
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Pradhan Ji
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#cccccc",
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Video Editor & UI/UX
                </Typography>
              </Grid>

              {/* Team Member 3 */}
              <Grid
                item
                xs={6}
                sm={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    animation: `${fadeInFromRight} 1s ease-in-out forwards`,
                    opacity: isTeamMembersVisible ? 1 : 0,
                    transform: isTeamMembersVisible
                      ? "none"
                      : "translateX(50px)",
                    transition: "all 1s ease-out",
                  }}
                >
                  <ImageContainer>
                    <StyledImage src={teamMember3} alt="Team Member 3" />
                  </ImageContainer>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ffffff",
                    marginTop: 1,
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Romuedeep Das
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#cccccc",
                    animation: `${
                      isTeamMembersVisible ? fadeInFromLeft : fadeOutFromLeft
                    } 1s ease-out forwards`,
                  }}
                >
                  Web Developer
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </GlassmorphismContainer>
  );
};

export default AboutMe;
