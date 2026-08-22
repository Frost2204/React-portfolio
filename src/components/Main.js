import React from 'react';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './GameSection';
import ExperienceSection from './ExperienceSection';
import SectionFour from './BlenderSection';
import SectionFive from './ProjectsSection';
import FavoriteGames from './EpicPlaygrounds'; // New Section
import About from './about';
import VisualVibe from './visualvibe';
import FixedButton from './FixedButton';

import { Analytics } from "@vercel/analytics/react"

import GameMechanics from './GameMechanics';

const Main = () => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <ExperienceSection />
      <SectionThree />
      <GameMechanics />
      <SectionFour />
      <SectionFive />
      <About />
      <FavoriteGames />
      {/* <VisualVibe /> */}
      <FixedButton />
      <Analytics/>
    </div>
  );
};

export default Main;
