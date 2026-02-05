import express from "express";
import cors from "cors";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer (temporary storage)
const upload = multer({ dest: "uploads/" });

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    res.json({
      status: "uploaded",
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
