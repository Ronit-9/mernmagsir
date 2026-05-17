import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fileUpload from "express-fileupload";
import cors from "cors";



const app = express();
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));


app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://ronitkhadka:9803945441@cluster0.4hpdqhq.mongodb.net/").then(() => {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
}).catch((err) => {
  console.log(err);
});

app.get("/", (req, res) => {
  return res.status(200).json("Welcome to the social networking app");
}
)
app.use('/uploads', express.static('uploads'));
app.use('/profileuploads', express.static('profileuploads'));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
