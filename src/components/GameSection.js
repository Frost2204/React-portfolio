import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';

// Importing local images and GIFs from src/customStyle
import projectOneImage from './customStyle/Games/FortressDash.png';
import projectOneGif from './customStyle/Games/gif/fortress.gif';
import projectTwoImage from './customStyle/Games/Aim Down.png';
import projectTwoGif from './customStyle/Games/gif/aimdown.gif';
import projectThreeImage from './customStyle/Games/Project Mars.png';
import projectThreeGif from './customStyle/Games/gif/rocket.gif';
import projectFourImage from './customStyle/Games/flappybird.png';
import projectFourGif from './customStyle/Games/gif/bird.gif';
import projectFiveImage from './customStyle/Games/baloon.jpg';
import projectFiveGif from './customStyle/Games/gif/baloon.gif';
import projectSixImage from './customStyle/Games/MechInvasion.webp';
import projectSixGif from './customStyle/Games/gif/MechInvasion.gif';


const projects = [
  {
    name: 'Mech Invasion',
    image: projectSixImage,
    hoverGif: projectSixGif,
    skills: ['Link List','Infinite Level', 'Score Manage', 'High Score'],
    description: 'Defend, Strategize, and Conquer Step into the thrilling sequel to the hit tower defence action-strategy game! With new weapons, dynamic landscapes, and endless tactical possibilities, this game takes the genre to the next level.',
    link: 'https://play.google.com/store/apps/details?id=com.DelightPlusGames.TowerDefence&pcampaignid=web_share',
  },
  {
    name: 'Fortress Dash',
    image: projectOneImage,
    hoverGif: projectOneGif,
    skills: ['Link List', 'Object Pickup', 'Infinite Level', 'Score Manage', 'High Score'],
    description: 'Play as the Wizard King who is running away from danger while dodging heavy rocks and other obstacles. The goal is to achieve the highest score possible by avoiding obstacles and collecting power-ups.',
    link: 'https://github.com/Frost2204/Fortress-Dash',
  },
  {
    name: 'Aim Down',
    image: projectTwoImage,
    hoverGif: projectTwoGif,
    skills: ['Ammo PickUp', 'FPS', 'Enemy AI','Shooting'],
    description: 'Welcome to Dark Survival Game, a single-player survival game set in a dark, mysterious environment where your only friend is a flashlight.',
    link: 'https://github.com/Frost2204/Aim-Down',
  },
  {
    name: 'Project Mars',
    image: projectThreeImage,
    hoverGif: projectThreeGif,
    skills: ['Gravity', 'Force Control', '2.5 D','Multiples Levels'],
    description: 'Welcome to the Rocket Landing Game! 🎮 In this exciting game, your mission is to pilot a rocket and land it safely on a rocky and dark environment.',
    link: 'https://github.com/Frost2204/Project-Mars',
  },
  {
    name: 'Flappy Bird',
    image: projectFourImage,
    hoverGif: projectFourGif,
    skills: ['Gravity', 'Infinite Level', 'High Score'],
    description: 'Flappy Bird is an arcade-style game in which the player controls the bird Faby, which moves persistently to the right.',
    link: 'https://github.com/Frost2204/Flarpy-Bird',
  },
  {
    name: 'Balloon Pop Game',
    image: projectFiveImage,
    hoverGif: projectFiveGif,
    skills: ['Infinite Level', 'High Score'],
    description: 'Balloon Pop Game is a fun and interactive game where players pop balloons to score points.',
    link: 'https://github.com/Frost2204/BaloonBurst',
  }
];

const SectionThree = () => {
  const [visible, setVisible] = useState({
    title: false,
    subtitle: false,
  });

  const observerRef = useRef();

  // Set up IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetId = entry.target.getAttribute('data-id');
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [targetId]: true,
            }));
          } else {
            setVisible((prev) => ({
              ...prev,
              [targetId]: false,
            }));
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    const elements = document.querySelectorAll('.fade-item');
    elements.forEach((element) => observer.observe(element));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6" id="Games" style={{ overflowX: 'hidden' }}>
      {/* Title with Animation */}
      <Typography
        variant="h1"
        className={`fade-item text-center mb-4 transition-all duration-700 ${visible.title ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
        data-id="title"
      >
        <span className="text-[60px] font-bold">My Game</span>
      </Typography>

      {/* Subtitle with Animation */}
      <Typography
        className={`fade-item text-center mb-8 transition-all duration-700 ${visible.subtitle ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
        data-id="subtitle"
      >
        Some of the cool Games I worked on in Unity & Unreal Engine
      </Typography>

      {/* Project Grid with fade-in effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {projects.map((project, index) => (
          <Box
            key={index}
            className={`fade-item p-6 bg-[#232529] rounded-lg shadow-lg transition-opacity duration-700 ${visible[index] ? 'opacity-100' : 'opacity-0'}`}
            data-id={index} // Ensuring each box is observed separately
            sx={{
              backdropFilter: 'blur(10px)', // Glass effect
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
              borderRadius: '20px', // Rounded corners for each project box
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)', // Light shadow around the box
            }}
          >
            <div className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4">
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300"
                onMouseEnter={(e) => {
                  if (project.hoverGif) e.currentTarget.src = project.hoverGif;
                }}
                onMouseLeave={(e) => (e.currentTarget.src = project.image)}
              />
            </div>
            <Typography variant="h6" className="text-left mt-2 mb-2 px-4 py-1 font-bold">
              {project.name}
            </Typography>
            <Typography variant="body2" className="px-4 mb-2 text-gray-400 text-left py-1">
              {project.description}
            </Typography>
            <div className="flex justify-start flex-wrap gap-2 px-4 mt-5 mb-0">
              {project.skills.map((skill, i) => (
                <Chip key={i} label={skill} className="rounded-full" color="primary" variant="outlined" style={{ padding: '4px 8px' }} />
              ))}
            </div>
            {project.link && (
              <Box className="flex justify-start px-4 mt-4">
                <Button
                  variant="outlined"
                  color="white"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    border: '2px solid white',
                    backgroundColor: 'transparent',
                  }}
                  className="hover:border-white hover:shadow-lg hover:shadow-slate-300"
                >
                  View Project
                </Button>
              </Box>
            )}
          </Box>
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="contained"
          color="primary"
          href="https://github.com/Frost2204"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: '20px',
            padding: '10px 20px',
          }}
          className="hover:bg-blue-600"
        >
          View More
        </Button>
      </div>
    </div>
  );
};

export default SectionThree;
