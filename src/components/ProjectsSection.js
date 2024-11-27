import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import Contact from './Contact'; // Import the new Contact component

// Importing local images from src/customStyle
import projectOneImage from './customStyle/adsvenchar.png';
import projectThreeImage from './customStyle/snake.png';
import projectFourImage from './customStyle/piano.png';
import projectFiveImage from './customStyle/codeeditor.jpeg';
import projectSixImage from './customStyle/entrancewise.jpg';

const projects = [
  {
    name: 'AdsVenchar',
    image: projectOneImage,
    skills: ['HTML', 'CSS', 'JavaScript'],
    description: 'A web-based adventure game where users can explore different scenarios.',
    link: 'https://frost2204.github.io/AdsVenchar2.0/index.html',
  },
  {
    name: 'Snake Game',
    image: projectThreeImage,
    skills: ['HTML', 'CSS', 'JavaScript'],
    description: 'A classic snake game built using web technologies for browser play.',
    link: 'https://frost2204.github.io/Snake-game/',
  },
  {
    name: 'Piano',
    image: projectFourImage,
    skills: ['HTML', 'CSS', 'JavaScript'],
    description: 'A web-based piano application where users can play piano using keyboard keys.',
    link: 'https://frost2204.github.io/Piano/',
  },
  {
    name: 'Joinode- Online Code Editor',
    image: projectFiveImage,
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'MongoDB'],
    description: 'A web-based code application where multiple users can compile and write Java code.',
  },
  {
    name: 'Entrance Wise',
    image: projectSixImage,
    skills: ['HTML', 'CSS', 'TypeScript', 'React'],
    description: 'A web-based E-learning platform where users can prepare for JEE Mains or Advanced as well as for NEET.',
  },
];

const SectionThree = () => {
  const [visible, setVisible] = useState({});
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

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-6" id="projects">
      {/* Title with Animation */}
      <Typography
        variant="h1"
        className={`fade-item text-center mb-4 transition-all duration-700 ${visible.title ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
        data-id="title"
      >
        <span className="text-[60px] font-bold">Projects</span>
      </Typography>

      {/* Subtitle with Animation */}
      <Typography
        className={`fade-item text-center mb-8 transition-all duration-700 ${visible.subtitle ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
        data-id="subtitle"
      >
        These are Some of the projects I've worked on.
      </Typography>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {projects.map((project, index) => (
          <Box
            key={index}
            className={`fade-item p-6 bg-[#232529] rounded-lg shadow-lg transition-opacity duration-700 ${visible[index] ? 'opacity-100' : 'opacity-0'}`}
            data-id={index} // Ensuring each box is observed separately
            style={{
              background: 'rgba(255, 255, 255, 0.1)', // Transparent background
              backdropFilter: 'blur(10px)', // Apply blur effect behind
              borderRadius: '10px', // Rounded corners for a glass effect
              border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border for glass look
            }}
          >
            <div className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4">
              {/* Image Hover Scale Effect */}
              <img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
              />
            </div>
            {/* Project Name */}
            <Typography
              variant="h6"
              className="text-left mt-2 mb-2 px-4 py-1 transition-all duration-300 font-bold"
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
            <div className="flex justify-start flex-wrap gap-2 px-4 mb-4">
              {project.skills.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  className="rounded-full"
                  color="primary"
                  variant="outlined"
                  style={{ padding: '4px 8px' }}
                />
              ))}
            </div>
            {/* Project Link or Contact Button */}
            <Box className="flex justify-start px-4 mt-4">
              {project.link ? (
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
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  className="hover:border-white hover:shadow-lg hover:shadow-slate-300"
                >
                  View Project
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="white"
                  onClick={handleClickOpen}
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    border: '2px solid white',
                    backgroundColor: 'transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  className="hover:border-white hover:shadow-lg hover:shadow-slate-300"
                >
                  Contact
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </div>

      {/* Contact Form Dialog */}
      <Contact open={open} onClose={handleClose} />
    </div>
  );
};

export default SectionThree;
