import './App.css';
import ParticlesBg from 'particles-bg'
import React, { Component } from 'react'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';

import Logo from './components/Logo/Logo';
import 'tachyons';

//import Tilt from 'react-parallax-tilt';



class App extends Component {
  render() {
    return (
      <div className="App">
          <ParticlesBg  color="add8e7" type="cobweb" bg={true} />
          <ParticlesBg  color="add8e7" type="cobweb" bg={true} />
          <ParticlesBg  color="add8e7" type="cobweb" bg={true} />
          <ParticlesBg  color="add8e7" type="cobweb" bg={true} />
    


          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm />
          {/* <FaceRecognition /> */}

  
          
  
      </div>
    ); 
  }
}

export default App;
