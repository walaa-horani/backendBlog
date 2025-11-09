import express from "express";
import { authMiddleware } from "../../middleware/AuthMiddleware.js";
import Blog from "../../models/Blog.js";
import Comment from "../../models/Comment.js";
const router = express.Router()


router.get("/all-comments-count", authMiddleware, async(req,res)=> {
    try {

        const blogs = await Blog.find({ author: req.user.id})
        const blogsIds = blogs.map(b => b._id) 
        const comments =  await Comment.countDocuments({ blog: { $in: blogsIds } })
         res.status(200).json({
      success: true,
      comments
    });
    } catch (error) {
         res.status(500).json({
      success: false,
      message: error.message
    });
    }
})


router.get("/user-comments" , authMiddleware,async(req,res)=> {
    try {

      const blogs = await Blog.find({author:req.user.id}) 
        const blogIds = blogs.map(b => b._id);

        const comments = await Comment.find({ blog: { $in: blogIds } })
         .populate("blog", "title category")

          .sort({ createdAt: -1 });

          res.status(200).json({
             success: true,
            count: comments.length,
            comments
          })
        
    } catch (error) {
        
    }
})


export default router