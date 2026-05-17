import path from "path";
import { v4 as uuidv4 } from "uuid";

const supportedTypes = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

export const fileCheck = (req, res, next) => {
  const file = req.files?.image;
  if (!file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!supportedTypes.includes(ext)) {
    return res.status(400).json({ message: "Invalid file type. Only .jpg, .jpeg, .png, .gif, .bmp files are allowed." });
  }

  const imagePath = `${uuidv4()}-${file.name}`;
  const uploadPath = path.resolve("uploads", imagePath);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).json({ message: "Failed to upload file" });
    req.imagePath = imagePath;
    next();
  });
};

export const updateFileCheck = (req, res, next) => {
  const file = req.files?.image;
  if (!file) return next();

  const ext = path.extname(file.name).toLowerCase();
  if (!supportedTypes.includes(ext)) {
    return res.status(400).json({ message: "Invalid file type. Only .jpg, .jpeg, .png, .gif, .bmp files are allowed." });
  }

  const imagePath = `${uuidv4()}-${file.name}`;
  const uploadPath = path.resolve("uploads", imagePath);

  file.mv(uploadPath, (err) => {
    if (err) return res.status(500).json({ message: "Failed to upload file" });
    req.imagePath = imagePath;
    next();
  });
};
