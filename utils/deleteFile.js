// utils/fileDelete.js
import fs from "fs/promises";
import path from "path";

export const fileDelete = async (filename) => {
  if (!filename) return;

  // Always resolve against uploads folder
  const filePath = path.resolve("uploads", filename);

  try {
    await fs.unlink(filePath);
    console.log("Deleted file:", filePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn("File not found, nothing to delete:", filePath);
    } else {
      console.error("Failed to delete file:", err.message);
    }
  }
};
