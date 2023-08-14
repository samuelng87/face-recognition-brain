import './App.css';
import ParticlesBg from 'particles-bg'
import React, { Component } from 'react'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Logo from './components/Logo/Logo'; 
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import 'tachyons';

//import Tilt from 'react-parallax-tilt';



// const app = new Clarifai.App ({
//     apiKey: '15769ef316d54213a0012db787c0a644'
//   });


  const returnsetupClarifaiJSONOptions = (imageUrl) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '56434d4fdc8a4dfba248e2a5116a8c7a';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'fs5wlo2t0gos';       
    const APP_ID = 'my-first-application-c1wbw';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;

}






class App extends Component {
  constructor() {
    super();this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route:'signin'
    }

  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

    onInputChange = (event) => {
     this.setState({input: event.target.value});
    }


    onButtonSubmit = () => {

 

      this.setState({imageUrl: this.state.input});
     
      fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnsetupClarifaiJSONOptions(this.state.input))
      .then(response => response.json())
        .then(response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}))
              })
  
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      this.setState({route: route});
    }

  render() {
    return (
      <div className="App">
          <ParticlesBg  color="add8e7" type="cobweb" num={435} bg={true} />
          <Navigation onRouteChange={this.onRouteChange}/>

          { this.state.route === 'home' 
          ? <div>
          <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} 
                        onButtonSubmit={this.onButtonSubmit}  
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
          : (
            this.state.route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
           )
         }

  
          
  
      </div>
    ); 
  }
}

export default App;

