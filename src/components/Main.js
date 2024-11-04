import React from 'react';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
import SectionFive from './SectionFive';
import About from './about';
import VisualVibe from './visualvibe';
import FixedButton from './FixedButton';

const Main = () => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionFour />
      <SectionFive />
      <SectionThree />
      <About />
      <VisualVibe />
      <FixedButton />
    </div>
  );
};

export default Main;
