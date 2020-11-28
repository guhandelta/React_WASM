import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import './App.css';

const ffmpeg = createFFmpeg({ log: true }); // Prints everythin that it does, on teh console
function App() {
  
  // The web assembly binary has not been bundled in the app yet 
  // It will be loaded async, to make sure it does not block the app, as it a huge file

  // Creating a state var to keep track of loading the binary file. It will ne loaded async over a CDN
  const [ ready, setReady ] = useState(false);
  const [ video, setVideo ] = useState(); //Initial Valu undefined

  const loadBinary = async () =>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() =>{
    loadBinary();
  }, []); // fn() called only once | componentDidMount

  return ready ? (
    <div className="App">

      {video && <video 
                  controls //video element controls
                  width="250"
                  /* The video can't be passed to the src attribute, so it needs to be converted to a URL-
                  - that the browser can fetch => URL.createObjectURL() */
                  src={URL.createObjectURL(video)}
                >

                </video>
      }
      <br/>
      <input 
        type="file" 
        onChange={e=>setVideo(e.target.files ?. item(0))}
        // EventHandler ger the actual file from the event which returns a list of files, and pick out the 1st one
      />
    </div>
  ):
  (<p>Loading...</p>);
}

export default App;
