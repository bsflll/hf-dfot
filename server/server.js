const express = require("express");
const cors = require("cors"); // Import the cors package
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Increase the size limit if needed (e.g., for image data)
app.use(bodyParser.json({ limit: "10mb" }));

// POST endpoint to receive the image
app.post("/upload", (req, res) => {
  const { image, timestamp } = req.body;
  if (!image) {
    return res.status(400).json({ error: "No image provided" });
  }


  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
  const saveDirectory = "/nas-dev/home/christina/hf-dfot/mecor_hq/saved-images";
  

  // Ensure the directory exists
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
  }

  // Save the image to a file
  const filename = path.join(saveDirectory, `frame-${timestamp}.jpg`);
  fs.writeFile(filename, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return res.status(500).json({ error: "Failed to save image" });
    }
    console.log("Image saved:", filename);
    res.json({ success: true, filename });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));