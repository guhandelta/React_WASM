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
  const [ gif, setGif ] = useState(); //To hold the URL of the generated .gif file

  const loadBinary = async () =>{
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() =>{
    loadBinary();
  }, []); // fn() called only once | componentDidMount

  const convertToGif = async () =>{
    // Write the file to memory
    // WebAssembly manages its own in-memory filesystem, to ring ffmpeg() on that file, the filesystem must-
    //- be intimated about that file 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    // Save the input media file from end user as test.mp4, and saved it to a place in memory 
    // This video file can be accessed by web assembly | It only stays in memory until the browser is refreshed
    
    // Run ffmpeg() on the video
    // -i => input file | -t => assign length of the video | -ss => start seconds | -f => encode to
    await ffmpeg.run('-i', 'test.mp4', '-t', '12', '-ss', '0.5', '-f', 'gif', 'output.gif');

    // Read the result from memory
    const convGif = ffmpeg.FS('readFile', 'output.gif')

    // Convert the output file into URL, allowing it to be fetched by the browser
    const url = URL.createObjectURL(new Blob([convGif.buffer], { type: 'image/gif' }));
    // Blob => raw file, which in this case is the binary | MIME type

    // Set the file URL to the state
    setGif(url); 

  }

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
      <br/>
      <h3>Result</h3>
      <br/><br/>
      <button onClick={convertToGif}>Convert</button>
      <br/><br/>
      { gif && <img src={gif} width="250"/> }
    </div>
  ):
  (<p>Loading...</p>);
}

export default App;
