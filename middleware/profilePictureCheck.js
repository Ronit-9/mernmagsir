import path from "path";
import { v4 as uuidv4 } from "uuid";

const supportedTypes = [".jpg", ".jpeg", ".png", ".gif"];

export const profilePictureCheck = (req, res, next) => {
  const file = req.files?.profilePicture; // expect key 'profilePicture'

  if (!file) return next();

  const ext = path.extname(file.name).toLowerCase();
  if (!supportedTypes.includes(ext)) {
    return res.status(400).json({
      message: "Invalid file type. Only .jpg, .jpeg, .png, and .gif files are allowed."
    });
  }

  const imagePath = `${uuidv4()}-${file.name}`;
  file.mv(`./profileuploads/${imagePath}`, (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to upload file" });
    }
    req.imagePath = imagePath; // filename only
    next();
  });
};
