import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import './App.css';

const ffmpeg = createFFmpeg({ log: true }); // Prints everythin that it does, on teh console
function App() {
  
  // The web assembly binary has not been bundled in the app yet 
  // It will be loaded async, to make sure it does not block the app, as it a huge file

  // Creating a state var to keep track of loading the binary file. It will ne loaded async over a CDN
  const [ ready, setReady ] = useState(false);

  const loadBinary = async () =>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() =>{
    loadBinary();
  }, []); // fn() called only once | componentDidMount

  return ready ? (
    <div className="App">
      
    </div>
  ):
  (<p>Loading...</p>);
}

export default App;
