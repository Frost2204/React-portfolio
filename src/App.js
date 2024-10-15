import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './index.css'; // Ensure this points to your global CSS file

const App = () => {
  return (
    <div>
      <Header/>
      <Main />
      <Footer />
    </div>
  );
};
export default App;
