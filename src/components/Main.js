import React from 'react';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import SectionFour from './SectionFour';
import About from './about'
import VisualVibe from './visualvibe'


const Main = () => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <About/>
      <VisualVibe/>      
    </div>
  );
};

export default Main;
