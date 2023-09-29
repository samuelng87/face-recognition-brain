import "./App.css";
import ParticlesBg from "particles-bg";
import React, { Component } from "react";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Rank from "./components/Rank/Rank";
import Logo from "./components/Logo/Logo";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "tachyons";
// import Clarifai from 'clarifai';

//import Tilt from 'react-parallax-tilt';

// const app = new Clarifai.App ({
//     apiKey: '15769ef316d54213a0012db787c0a644'
//   });

const returnsetupClarifaiJSONOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "43538a82fe9f42678903206a62df1275";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "fs5wlo2t0gos";
  const APP_ID = "test";
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = "face-detection";
  // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'
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
          },
        },
      },
    ],
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
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedIn: false,
      user: {
        id: '124',
        name: 'sally',
        email: 'sally@example.com',
        password: 'bananas',
        entries:0,
        joined: new Date()
      }
    }
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState ({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined
      }})
    }


  calculateFaceLocation = (data) => {
    if (data && data.response && data.response.outputs[0]) {
      const clarifaiFace = data.response.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height
      };
    } else {
      // Handle the case where the data structure doesn't match your expectations
      console.error("Invalid data structure from Clarifai API");
      return {}; // Return an empty object or some default values
    }
  };
  



  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
  
    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      returnsetupClarifaiJSONOptions(this.state.input)
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.outputs && data.outputs.length > 0) {
          this.displayFaceBox(this.calculateFaceLocation(data));
        } else {
          console.error("Invalid data structure from Clarifai API");
          // Handle the case where the data structure doesn't match your expectations
        }
      })
      .catch((err) => {
        console.error("Error fetching data from Clarifai API:", err);
        // Handle the error, display an error message, or take appropriate action
      });
  };
  

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  };

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <ParticlesBg color="add8e7" type="cobweb" num={435} bg={true} />
        <Navigation isSignedIn={ isSignedIn} onRouteChange={this.onRouteChange} />

        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
