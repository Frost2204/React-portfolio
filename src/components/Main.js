import React from 'react';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './GameSection';
import SectionFour from './BlenderSection';
import SectionFive from './ProjectsSection';
import FavoriteGames from './EpicPlaygrounds'; // New Section
import About from './about';
import VisualVibe from './visualvibe';
import FixedButton from './FixedButton';

const Main = () => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <About />
      <FavoriteGames />
      <VisualVibe />
      {/* <FixedButton /> */}
    </div>
  );
};

export default Main;
