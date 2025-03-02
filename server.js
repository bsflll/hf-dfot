const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Increase the size limit if needed (e.g., for video data)
app.use(bodyParser.json({ limit: "50mb" }));

// POST endpoint to receive the video
app.post("/upload", (req, res) => {
  const { video, timestamp } = req.body;
  if (!video) {
    return res.status(400).json({ error: "No video provided" });
  }
  
  // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
  const base64Data = video.replace(/^data:.*;base64,/, "");
  const saveDirectory = path.join(__dirname, "saved_videos");

  // Ensure the directory exists
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
  }

  // Save the video to a file (use .mp4 extension if that's what you're recording)
  const filename = path.join(saveDirectory, `clip-${timestamp}.mp4`);
  fs.writeFile(filename, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving video:", err);
      return res.status(500).json({ error: "Failed to save video" });
    }
    console.log("Video saved:", filename);
    res.json({ success: true, filename });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

