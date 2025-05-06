const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dt9owkw7t", // Replace with your Cloudinary cloud name
  api_key: "745349512795759", // Replace with your Cloudinary API Key
  api_secret: "ho0pllGkj_xfv2tqWV6K3jv1UAQ", // Replace with your Cloudinary API Secret
});

// Endpoint to delete an image
app.post("/delete-image", async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ error: "Missing publicId" });
  }

  try {
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({ success: true, message: "Image deleted successfully" });
    } else {
      res.status(400).json({ error: "Failed to delete image", details: result });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
