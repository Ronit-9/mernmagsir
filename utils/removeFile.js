import fs from "fs/promises";

export const removeFile = async (filePath) => {
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
