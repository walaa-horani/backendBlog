import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./routes/Users.js"
import Blogs from "./routes/Blogs.js"


import Comment from "./routes/Comments.js"
import Generate from "./controllers/blogController.js"
import BlogDashboard from "./routes/dashboard/Blog.js"
import CommentDashboard from "./routes/dashboard/Comments.js"
import GenerateComment from "./controllers/commentController.js"
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-blog-a-react.vercel.app",
  "https://frontend-blog-a-react-git-main-walaa-horanis-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


app.use("/users", User);
app.use("/blogs", Blogs);
app.use("/comments", Comment);
app.use("/dashboard/blog", BlogDashboard);
app.use("/dashboard/comment", CommentDashboard);
app.use("/ai", Generate);

app.use("/commentAi", GenerateComment);
app.use("/images", express.static("images"));
connectDB()


const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});