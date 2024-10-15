import React, { useEffect, useRef } from 'react';
import './customStyle/sectionone.css';

const SectionOne = () => {
  const spanRef = useRef(null);

  useEffect(() => {
    const words = ["Web", "Graphic", "Java"];
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
      <div className="hero-contain">
        <div className="hero-text">
          <h1 className="display-1 pt-32 font-bold for-rotator">Hi!🐱‍👓</h1>
          <h1 className="display-hero for-rotator font-bold">I'm Nikunj</h1>
          <span id="word" ref={spanRef} style={{ fontSize: '80px' }}></span>
          <span className="cursor"></span>|
          <div className="margin-container-hero">
            <span className="developer-text">Developer</span>
          </div>
          <div className="margin-50px ">
            <div className="button-flex mt-20">
              <a
                href="https://drive.google.com/file/d/1XsL4-wDGeLsdXRjrikbeSUX7Hqw8ea7g/view?usp=sharing"
                target="_blank"
                className="button-purp w-button"
                rel="noreferrer"
                aria-label="Download Resume"
              >
                Download Resume
              </a>
              <div className="horizontal-divider"></div>
              <a href="#projects" className="button-hero black w-button" aria-label="View Projects">
                View Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;