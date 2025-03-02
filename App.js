// import React, { useState, useEffect, useRef } from "react";

// function App() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [facingMode, setFacingMode] = useState("environment"); // "environment" = back, "user" = front
//   const [lastFrameTime, setLastFrameTime] = useState("No frame sent yet");
//   const [textColor, setTextColor] = useState("#fff"); // Default white text

//   // Set up the camera stream when facingMode changes
//   useEffect(() => {
//     let stream;
//     async function setupCamera() {
//       if (videoRef.current && navigator.mediaDevices.getUserMedia) {
//         try {
//           // Stop any active tracks before switching cameras
//           if (videoRef.current.srcObject) {
//             videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//           }
//           stream = await navigator.mediaDevices.getUserMedia({
//             video: { facingMode },
//           });
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         } catch (error) {
//           console.error("Error accessing camera:", error);
//         }
//       }
//     }
//     setupCamera();
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [facingMode]);

//   // Capture a frame every 30 seconds and send it to the server
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (videoRef.current && canvasRef.current) {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;
//         const width = video.videoWidth;
//         const height = video.videoHeight;
    
//         // Set canvas size to be a square with side equal to the video width
//         canvas.width = width;
//         canvas.height = width;
//         const ctx = canvas.getContext("2d");
    
//         // Determine the square crop dimensions.
//         let sx, sy, sSize;
//         if (height >= width) {
//           // If the video is taller, crop vertically.
//           sx = 0;
//           sy = (height - width) / 2;
//           sSize = width;
//         } else {
//           // If the video is wider, crop horizontally.
//           sx = (width - height) / 2;
//           sy = 0;
//           sSize = height;
//         }
    
//         // Draw the cropped square onto the canvas.
//         // This maps the source square (sx, sy, sSize, sSize) to the entire square canvas.
//         ctx.drawImage(video, sx, sy, sSize, sSize, 0, 0, width, width);
    
//         // Convert the canvas image to a data URL.
//         const dataUrl = canvas.toDataURL("image/jpeg");
    
//         // Send the dataUrl to the server...
//         fetch("https://9abd-101-47-22-247.ngrok-free.app/upload", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ image: dataUrl, timestamp: Date.now() }),
//         })
//           .then((response) => response.json())
//           .then((data) => {
//             const time = new Date().toLocaleTimeString();
//             setLastFrameTime(`Last frame sent at ${time}`);
//             // Toggle text color to red for 1 second
//             setTextColor("red");
//             setTimeout(() => setTextColor("#fff"), 1000);
//             console.log("Frame sent at", time, "Server response:", data);
//           })
//           .catch((error) => console.error("Error sending image:", error));
//       }
//     }, 45000); // 45 seconds
//     return () => clearInterval(interval);
//   }, []);

//   // Toggle between front and back cameras
//   const toggleCamera = () => {
//     setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>Axon Robot Feed</h1>
//       <button onClick={toggleCamera} style={styles.toggleButton} aria-label="Switch Camera">
//         🔄
//       </button>
//       <div style={styles.videoContainer}>
//         <video ref={videoRef} style={styles.video} playsInline muted />
//       </div>
//       {/* Display last frame sent time directly below the video */}
//       <p style={{ ...styles.text, color: textColor }}>{lastFrameTime}</p>
//       {/* Hidden canvas for capturing video frames */}
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </div>
//   );
// }

// const styles = {
//   container: {
//     backgroundColor: "#000",
//     minHeight: "100vh",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     color: "#fff",
//     padding: 20,
//   },
//   title: {
//     fontSize: "24px",
//     fontWeight: "bold",
//     position: "absolute",
//     top: 40,
//   },
//   toggleButton: {
//     position: "absolute",
//     top: 40,
//     right: 20,
//     backgroundColor: "transparent",
//     border: "none",
//     fontSize: "24px",
//     color: "#fff",
//   },
//   videoContainer: {
//     width: "70%",
//     height: "70%",
//   },
//   video: {
//     width: "100%",
//     borderRadius: "8px",
//   },
//   text: {
//     fontSize: "16px",
//     marginTop: "10px",
//   },
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // "environment" = back, "user" = front
  const [lastFrameTime, setLastFrameTime] = useState("No video sent yet");
  const [textColor, setTextColor] = useState("#fff"); // Default white text

  // Set up the camera stream when facingMode changes
  useEffect(() => {
    let stream;
    async function setupCamera() {
      if (videoRef.current && navigator.mediaDevices.getUserMedia) {
        try {
          // Stop any active tracks before switching cameras
          if (videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
          }
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
          });
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Function to record a 1-second square video clip
  const recordOneSecondVideo = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    // Set canvas size to be a square (width x width)
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext("2d");

    // Calculate crop dimensions for a square crop
    let sx, sy, sSize;
    if (height >= width) {
      sx = 0;
      sy = (height - width) / 2;
      sSize = width;
    } else {
      sx = (width - height) / 2;
      sy = 0;
      sSize = height;
    }

    // Start drawing loop to continuously update the canvas from the video
    let animationFrameId;
    const drawFrame = () => {
      ctx.drawImage(video, sx, sy, sSize, sSize, 0, 0, width, width);
      animationFrameId = requestAnimationFrame(drawFrame);
    };
    drawFrame();

    // Capture the canvas stream (30fps)
    const stream = canvas.captureStream(30);
    let mimeType = "video/mp4";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      // Fallback to webm if mp4 is not supported
      mimeType = "video/webm";
    }
    const mediaRecorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      cancelAnimationFrame(animationFrameId);
      const blob = new Blob(chunks, { type: mimeType });
      // Convert the Blob to a data URL to send as JSON
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        fetch("https://9abd-101-47-22-247.ngrok-free.app/upload", {
        //fetch("https://6ba8-38-34-121-59.ngrok-free.app/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video: dataUrl, timestamp: Date.now() }),
        })
          .then((response) => response.json())
          .then((data) => {
            const time = new Date().toLocaleTimeString();
            setLastFrameTime(`Last video sent at ${time}`);
            setTextColor("red");
            setTimeout(() => setTextColor("#fff"), 1000);
            console.log("Video sent at", time, "Server response:", data);
          })
          .catch((error) => console.error("Error sending video:", error));
      };
      reader.readAsDataURL(blob);
    };

    // Start recording and stop after 1 second
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 1000);
  };

  // Record a 1-second video clip every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      recordOneSecondVideo();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Toggle between front and back cameras
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Axon Robot Feed</h1>
      <button onClick={toggleCamera} style={styles.toggleButton} aria-label="Switch Camera">
        🔄
      </button>
      <div style={styles.videoContainer}>
        <video ref={videoRef} style={styles.video} playsInline muted />
      </div>
      {/* Display last video sent time directly below the video */}
      <p style={{ ...styles.text, color: textColor }}>{lastFrameTime}</p>
      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#000",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "#fff",
    padding: 20,
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    position: "absolute",
    top: 40,
  },
  toggleButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#fff",
  },
  videoContainer: {
    width: "70%",
    height: "70%",
  },
  video: {
    width: "100%",
    borderRadius: "8px",
  },
  text: {
    fontSize: "16px",
    marginTop: "10px",
  },
};

export default App;

