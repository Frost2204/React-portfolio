import React, { useEffect, useRef, useState } from "react";
import "./customStyle/sectionone.css";
import videoSource from "./customStyle/bg.mp4"; // Add your video source path

const SectionOne = () => {
  const spanRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const words = ["Game", "Web", "Blender"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const word = words[index];

      if (isDeleting) {
        spanRef.current.textContent = word.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          index = (index + 1) % words.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, 100);
        }
      } else {
        spanRef.current.textContent = word.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === word.length) {
          isDeleting = true;
          setTimeout(type, 1500);
        } else {
          setTimeout(type, 100);
        }
      }
    };

    type();
  }, []);

  return (
    <div id="Top" className="hero mt-12">
      {/* Video Background */}
      <video autoPlay muted loop className="video-bg">
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="hero-contain">
        <div className="hero-text">
          <h1 className="display-1 pt-32 font-bold for-rotator">Hi!🐱‍👓</h1>
          <h1 className="display-hero for-rotator font-bold">I'm Nikunj</h1>
          <span id="word" ref={spanRef} style={{ fontSize: "80px" }}></span>
          <span className="cursor"></span>|
          <div className="margin-container-hero">
            <span className="developer-text">Developer</span>
          </div>
          <div className="margin-50px">
            <div className="button-flex mt-20">
              {/* Resume Button */}
              <a
                href="https://drive.google.com/file/d/13Z_hvkLEwNuf150JThNk5wDa4iIfcfi4/view?usp=sharing"
                target="_blank"
                className="button-purp w-button"
                rel="noreferrer"
                aria-label="Download Resume"
              >
                View Resume
              </a>
              <div className="horizontal-divider"></div>

              {/* Dropdown Container */}
              <div className="relative group">
                {/* View Projects Button */}
                <a
                  href="#"
                  className="button-hero black top-2 w-button px-6 py-3 relative z-20"
                  aria-label="View Projects"
                >
                  View Projects
                </a>

                {/* 🔽 Dropdown for Mobile (Appears Below) */}
                <div className="absolute top-full mt-2 w-52 bg-gray-900 text-white shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 md:hidden">
                  <a
                    href="#Games"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🎮 Game Projects
                  </a>
                  <a
                    href="#gamemechanics"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🔨 Game Mechanics
                  </a>
                  <a
                    href="#blender"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🎨 Blender Projects
                  </a>
                  <a
                    href="#projects"
                    className="block px-5 py-3 hover:bg-gray-700 transition"
                  >
                    💻 Other Projects
                  </a>
                </div>

                {/* ➡️ Dropdown for Desktop (Appears Right) */}
                <div className="absolute bottom-0 left-full ml-2 w-52 bg-gray-900 text-white shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 hidden md:block">
                  <a
                    href="#Games"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🎮 Game Projects
                  </a>
                  <a
                    href="#gamemechanics"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🔨 Game Mechanics
                  </a>
                  <a
                    href="#blender"
                    className="block px-5 py-3 border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    🎨 Blender Projects
                  </a>
                  <a
                    href="#projects"
                    className="block px-5 py-3 hover:bg-gray-700 transition"
                  >
                    💻 Other Projects
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;
