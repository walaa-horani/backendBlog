import express from "express";
import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";


const router = express.Router()


router.post("/add-comment",authMiddleware, async(req,res)=> {
    try {
        const {username ,comment,blogId } = req.body
        
         const newComment = await Comment.create({
           name: username,
            comment,
            blog: blogId  
         })

         res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment
    }); 

    } catch (error) {
       res.status(500).json({ 
      success: false, 
      message: error.message 
    });   
    }
})


router.get("/blog-comment/:blogId", async(req,res)=> {
    try {
         const { blogId } = req.params;


         const comments = await Comment.find({blog:blogId}) .populate("blog", "title category")
         .sort({ createdAt: -1 });

      res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });



         
        
    } catch (error) {
      res.status(500).json({
      success: false,
      message: error.message
    });    
    }
})




export default router