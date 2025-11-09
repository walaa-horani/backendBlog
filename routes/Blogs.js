import express from "express";
const router = express.Router()
import Blog from "../models/Blog.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";




router.get("/all-blogs", async(req,res)=> {
    try {
        const blogs = await Blog.find().populate("author","email name")

        res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });

    } catch (error) {
     res.status(500).json({
      success: false,
      message: error.message
    });    
    }
})






router.get("/:id", async(req,res)=> {
    try {
        const blog = await Blog.findById(req.params.id) .populate('author', 'name email');

        if(!blog){
          return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });   
        }

         const now = new Date();
         const lastUpdated = new Date(blog.updatedAt)
         const secondDiff = (now - lastUpdated)  / 1000

       if (secondDiff > 2) {
      blog.views += 1;
      await blog.save();
    }

       await blog.save();
       
      res.json({
      success: true,
      blog
    }); 

    } catch (error) {
        res.status(500).json({ 
      success: false, 
      message: error.message 
    }); 
    }
})




export default router