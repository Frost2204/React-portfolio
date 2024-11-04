import React from 'react';
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
    name: 'MI Speaker Model',
    image: projectFiveImage,
    skills: ['Blender', 'UV Wrap'],
    description: 'MI Brand Speaker made in blender',
  },
  {
    name: 'Room Model',
    image: projectSixImage,
    skills: ['Blender', 'UV Wrap'],
    description: 'A room mini model made in blender',
  },
];

const SectionThree = () => {
  return (
    <div className="p-6">
      <Typography variant="h1" className="text-center mb-4">
        <span className="text-[60px] font-bold">Blender</span>
      </Typography>
      <Typography className="text-center mb-8">These Are Renders And Models I created.</Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {projects.map((project, index) => (
          <Box
            key={index}
            className="p-6 bg-[#232529] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#1A1B1D] hover:shadow-xl relative"
          >
            <div className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4">
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg hover:scale-105 transition-all duration-300"
              />
            </div>
            <Typography
              variant="h6"
              className="text-left mt-2 mb-2 px-4 py-1 transition-all duration-300 font-bold"
            >
              {project.name}
            </Typography>
            {/* Project description under the name */}
            <Typography
              variant="body2"
              className="px-4 mb-2 text-gray-400 text-left py-1"
            >
              {project.description}
            </Typography>
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
          href="https://www.instagram.com/visualvibe.in/"
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

export default SectionThree;
