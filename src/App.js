import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Rank from "./components/Rank/Rank";
import Logo from "./components/Logo/Logo";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";
import "tachyons";

// Commenting out the Clarifai configuration as we're replacing it with Puter.ai
// const returnsetupClarifaiJSONOptions = (imageUrl) => {
//   // Your PAT (Personal Access Token) can be found in the portal under Authentification
//   const PAT = "43538a82fe9f42678903206a62df1275";
//   // Specify the correct user_id/app_id pairings
//   // Since you're making inferences outside your app's scope
//   const USER_ID = "fs5wlo2t0gos";
//   const APP_ID = "test";
//   // Change these to whatever model and image URL you want to use
//   const MODEL_ID = 'face-detection';
//   // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'
//   const IMAGE_URL = imageUrl;

//   const raw = JSON.stringify({
//     "user_app_id": {
//       "user_id": USER_ID,
//       "app_id": APP_ID
//   },
//   "inputs": [
//       {
//           "data": {
//               "image": {
//                   "url": IMAGE_URL
//           },
//         },
//       },
//     ],
//   });

//   const requestOptions = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': 'Key ' + PAT
//     },
//     body: raw
//   };

//   return requestOptions;
// };

const initialState = {
  input: '',
  imageUrl:'',
  //change to signin to home for easy view
  route: 'home',
  isSignedIn: false,
  analysisResult: '', // Add this to store the Puter.ai analysis result
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries:0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
    
    // Add the Puter.ai script to the document
    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    document.body.appendChild(script);
  }

  loadUser = (data) => {
    this.setState ({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input, analysisResult: 'Analyzing image...' });  
    
    // Simple URL validation
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    
    // Check if input is a valid URL
    if (!isValidUrl(this.state.input)) {
      this.setState({ 
        analysisResult: 'Please enter a valid image URL. Make sure it starts with http:// or https://' 
      });
      return;
    }
    
    // Check for Google encrypted URLs which may cause issues
    const isGoogleEncryptedUrl = (url) => {
      return url.includes('encrypted-tbn') || 
             url.includes('googleusercontent.com') || 
             url.includes('gstatic.com');
    };
    
    if (isGoogleEncryptedUrl(this.state.input)) {
      this.setState({
        analysisResult: 'Google encrypted thumbnail URLs often cause issues. Please try using the original image URL instead.\n\n' +
                       'Tip: Find the original image on Google, then right-click and select "Open image in new tab". Copy that URL instead.'
      });
      return;
    }
    
    // Replace Clarifai with Puter.ai
    if (window.puter && window.puter.ai) {
      // Set a timeout for the API call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );
      
      // Create the actual API request
      const apiPromise = window.puter.ai.chat(
        "Analyze this image in detail. Describe what you see including any people, objects, scenes, colors, and text visible in the image.", 
        this.state.input
      );
      
      // Race the timeout against the API call
      Promise.race([apiPromise, timeoutPromise])
        .then(response => {
          console.log('Puter.ai response:', response);
          
          // Extract the actual content from the response
          let formattedResponse = '';
          
          try {
            // Handle JSON object response
            if (typeof response === 'object') {
              // Check if it's the standard Puter.ai format
              if (response.message && response.message.content) {
                formattedResponse = response.message.content;
              } 
              // For other JSON responses
              else {
                formattedResponse = JSON.stringify(response, null, 2);
              }
            } 
            // Handle string response
            else if (typeof response === 'string') {
              // Check if it's a JSON string
              try {
                const parsedJson = JSON.parse(response);
                if (parsedJson.message && parsedJson.message.content) {
                  formattedResponse = parsedJson.message.content;
                } else {
                  formattedResponse = response;
                }
              } catch (e) {
                // Not a JSON string, use as is
                formattedResponse = response;
              }
            } 
            // Fallback for other types
            else {
              formattedResponse = String(response);
            }
          } catch (e) {
            console.error('Error formatting response:', e);
            formattedResponse = 'Error processing the analysis result. Please try again.';
          }
            
          this.setState({ analysisResult: formattedResponse });
          
          // Increment the entries counter (without backend)
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              entries: prevState.user.entries + 1
            }
          }));
        })
        .catch(error => {
          console.error('Error analyzing image with Puter.ai:', error);
          this.setState({ 
            analysisResult: 'Error analyzing image. This could be because:\n\n' +
                           '1. The URL is not accessible\n' +
                           '2. The URL does not point to a valid image\n' +
                           '3. The image format is not supported\n' +
                           '4. The server took too long to respond\n\n' +
                           'Please try a different image URL.' 
          });
        });
    } else {
      console.error('Puter.ai script not loaded');
      this.setState({ 
        analysisResult: 'Puter.ai script not loaded. Please try refreshing the page. If the problem persists, check your internet connection.' 
      });
    }
  };
  
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  };

  render() {
    const {isSignedIn, imageUrl, route, analysisResult} = this.state;
    return (
      <div className="App">
        <ParticlesBg color="add8e7" type="cobweb" num={435} bg={true} />
        {/* Comment out Navigation component that contains signin/register buttons */}
        {/* <Navigation isSignedIn={ isSignedIn} onRouteChange={this.onRouteChange} /> */}

        {/* Always show the home screen instead of conditional signin/register */}
        <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            imageUrl={imageUrl}
            analysisResult={analysisResult}
          />
        </div>
        
        {/* Original conditional rendering (commented out)
        {route === "home" 
        ? 
          <div>
            <Logo />
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
              analysisResult={analysisResult}
            />
          </div>
        : ( 
          route === "signin" 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        } */}
      </div>
    );
  }
}

export default App;
