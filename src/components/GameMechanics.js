import React, { useState } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";

// Importing images & GIFs
import shootingImage from "./customStyle/mechanics/shooting mechanics.png";
import shootingGif from "./customStyle/mechanics/gif/shooting.gif";

import carcont from "./customStyle/mechanics/car.png";
import carcontgif from "./customStyle/mechanics/gif/Car.gif";


import parkour from "./customStyle/mechanics/parkour.png";
import parGif from "./customStyle/mechanics/gif/parkour.gif";


import scroll from "./customStyle/mechanics/scroll.png";
import scrollGif from "./customStyle/mechanics/gif/scrollGif.gif";


import pi from "./customStyle/mechanics/piCollision.png";
import piGif from "./customStyle/mechanics/gif/pi.gif";



const mechanics = [
  {
    name: "Shooting System",
    image: shootingImage,
    gif: shootingGif,
    skills: [
      "Unreal Engine",
      "Visual Scripting",
      "Raycasting",
      "Ammo Management",
    ],
    description: "A dynamic shooting system with hit detection and recoil.",
    link: "https://github.com/Frost2204/Shooting-Game-Mechanics", // Replace with your actual link
  },
  {
    name: "Car Controller",
    image: carcont,
    gif: carcontgif,
    skills: ["Unity", "C#", "Collider", "Player Controller", "car"],
    description:
      "A Unity car driving system with acceleration, braking, and steering using Wheel Colliders.",
    link: "https://github.com/Frost2204/Car-Controller", // Replace with your actual link
  },
  {
    name: "Assassins Creed Parkour System",
    image: parkour,
    gif: parGif,
    skills: ["Unity", "C#", "Collider", "Player Controller", "Player Movement"],
    description:
      "A dynamic parkour system for Unity, allowing the player to vault over obstacles with randomized animations.",
    link: "https://github.com/Frost2204/Parkour-System", // Replace with your actual link
  },
  {
    name: "Smooth Scrollable Menu for Unity",
    image: scroll,
    gif: scrollGif,
    skills: ["Unity", "C#", "2D"],
    description:
      "Responsive UI with swipe & button navigation, auto-scaling, and perfect aspect ratio support. 🚀",
    link: "https://github.com/Frost2204/Smooth-Scrollable-Menu-for-Unity", // Replace with your actual link
  },
  {
    name: "Pi Collisions Simulation",
    image: pi,
    gif: piGif,
    skills: ["Unity", "C#", "2D"],
    description:
      "This project demonstrates the behavior of a small box colliding with a larger, heavier box, following the principles of momentum and energy conservation.",
    link: "https://github.com/Frost2204/Pi-Collisions-Simulation", // Replace with your actual link
  },
];

const GameMechanics = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="p-6" id="gamemechanics">
      {/* Main Heading */}
      <Typography variant="h1" className="text-center mb-2">
        <span className="text-[60px] font-bold">Game Mechanics</span>
      </Typography>

      {/* Subtitle */}
      <Typography variant="h6" className="text-center mb-6 text-gray-400">
        Here are some of the game mechanics I have worked on.
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
        {mechanics.map((mechanic, index) => (
          <Box
            key={index}
            className="p-6 transition-all duration-700 rounded-lg shadow-lg flex flex-col justify-between"
            sx={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* Image/GIF Swap on Hover */}
            <div
              className="relative w-full pb-[100%] rounded-lg overflow-hidden group mb-4"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={hovered === index ? mechanic.gif : mechanic.image}
                alt={mechanic.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300"
              />
            </div>

            {/* Project Info */}
            <Typography variant="h6" className="text-left mt-2 mb-2 font-bold">
              {mechanic.name}
            </Typography>
            <Typography variant="body2" className="text-gray-400 text-left">
              {mechanic.description}
            </Typography>
            <div className="flex justify-start flex-wrap gap-2 mt-5">
              {mechanic.skills.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  className="rounded-full"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </div>

            {/* View Project Button (Styled to Match SectionThree) */}
            {mechanic.link && (
              <Box className="flex justify-start mt-4">
                <Button
                  variant="outlined"
                  color="white"
                  href={mechanic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderRadius: "20px",
                    padding: "8px 16px",
                    border: "2px solid white",
                    backgroundColor: "transparent",
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
    </div>
  );
};

export default GameMechanics;
