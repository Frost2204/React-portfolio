import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';

// Importing local images from src/customStyle
import projectOneImage from './customStyle/renders/guitar.png';
import projectTwoImage from './customStyle/renders/car.jpg';
import projectThreeImage from './customStyle/renders/shoes.png';
import projectFourImage from './customStyle/renders/chess.png';
import projectFiveImage from './customStyle/renders/speaker.png';
import projectSixImage from './customStyle/renders/room.png';

const projects = [
  {
    name: 'Guitar Model',
    image: projectOneImage,
    skills: ['Blender', 'After Effect', 'UV Wrap'],
    description: 'Wooden Guitar Model',
  },
  {
    name: 'Car Render',
    image: projectTwoImage,
    skills: ['Blender', 'Texture'],
    description: 'Render Of A Car',
  },
  {
    name: 'FILA Shoes Model',
    image: projectThreeImage,
    skills: ['Blender', 'After Effect', 'UV Wrap'],
    description: 'A Model Of A Shoes Of Brand FILA.',
  },
  {
    name: 'Chess Piece Model',
    image: projectFourImage,
    skills: ['Blender', 'UV Wrap'],
    description: 'Chess Piece made in blender',
  },
  {
    name: 'boAt Speaker Model',
    image: projectFiveImage,
    skills: ['Blender', 'UV Wrap'],
    description: 'Boat Brand Speaker made in blender',
  },
  {
    name: 'Room Model',
    image: projectSixImage,
    skills: ['Blender', 'UV Wrap'],
    description: 'A room mini model made in blender',
  },
];

const SectionFour = () => {
  const [visible, setVisible] = useState({
    title: false,
    subtitle: false,
  });

  const observerRef = useRef();

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

    // Observe project box elements
    const elements = document.querySelectorAll('.fade-item');
    elements.forEach((element) => observer.observe(element));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6" id="blender">
      {/* Title */}
      <Typography
        variant="h1"
        className={`fade-item text-center mb-4 transition-all duration-700 ${visible.title ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
        data-id="title"
      >
        <span className="text-[60px] font-bold">Blender Models</span>
      </Typography>

      {/* Subtitle */}
      <Typography
        className={`fade-item text-center mb-8 transition-all duration-700 ${visible.subtitle ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
        data-id="subtitle"
      >
        These are some 3D models I created using Blender.
      </Typography>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {projects.map((project, index) => (
          <Box
            key={index}
            className={`p-6 fade-item transition-all duration-700 ${
              visible[`project-${index}`] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
            }`}
            data-id={`project-${index}`}
            sx={{
              backdropFilter: 'blur(10px)', // Glass effect
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
              borderRadius: '20px', // Rounded corners for each project box
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)', // Light shadow around the box
              transition: 'all 0.3s ease', // Smooth transition
              '&:hover': {
                backdropFilter: 'blur(15px)', // Intensified blur on hover
              },
            }}
          >
            <div className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4">
              {/* Image Scaling on hover */}
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
              />
            </div>
            {/* Project Name */}
            <Typography
              variant="h6"
              className="text-left mt-2 mb-2 px-4 py-1 font-bold transition-all duration-300"
            >
              {project.name}
            </Typography>
            {/* Project Description */}
            <Typography
              variant="body2"
              className="px-4 mb-2 text-gray-400 text-left py-1"
            >
              {project.description}
            </Typography>
            {/* Skills Tags */}
            <div className="flex justify-start flex-wrap gap-2 px-4 mt-5 mb-0">
              {project.skills.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  className="rounded-full"
                  color="primary"
                  variant="outlined"
                  style={{ padding: '4px 8px' }} // Add padding to each chip
                />
              ))}
            </div>
          </Box>
        ))}
      </div>

      {/* View More Button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="contained" // Use contained variant for a filled button
          color="primary"
          href="https://www.instagram.com/visualivibe/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            borderRadius: '20px',
            padding: '10px 20px',
            transition: 'background-color 0.3s',
          }}
          className="hover:bg-blue-600" // Change color on hover
        >
          View More
        </Button>
      </div>
    </div>
  );
};

export default SectionFour;
