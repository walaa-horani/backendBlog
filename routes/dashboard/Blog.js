
import express from "express";
import { authMiddleware } from "../../middleware/AuthMiddleware.js";
import path from "path";

import multer from "multer";
import Blog from "../../models/Blog.js";
const router = express.Router()


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
       const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' +  file.fieldname + ext
    cb(null,   filename)
  }
})



const upload = multer({ storage: storage, limits:{fileSize: 5  * 1024 * 1024} })

router.post("/add-blog", upload.single("thumbnail") ,authMiddleware, async(req,res)=> {

    try {
        const {title, subtitle, description, category, published} = req.body
        const blog = await Blog.create({
       title,
      subtitle,
      description,
      category,  
      
       published: published === 'true',
        author: req.user.id,
        thumbnail:req.file?.filename  

        })

       await blog.save() 

      res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });

    } catch (error) {
      res.status(500).json({ 
      success: false, 
      message: error.message 
    });  
    }
})



router.get("/all-blogs", authMiddleware, async(req,res)=> {
    try {
        const blogs = await Blog.find({ author: req.user.id }).populate("author","email name")
          .sort({ createdAt: -1 });
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


router.get("/blogs-count" , authMiddleware, async(req,res)=> {
    try {
        const count = await Blog.countDocuments({author: req.user.id})

       res.status(200).json({
      success: true,
      count
    });
    } catch (error) {
       res.status(500).json({
      success: false,
      message: error.message
    }); 
    }
})


router.delete("/delete-blog/:id",authMiddleware, async(req,res)=> {
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        if(!blog){
        return res.status(404).json({
        success: false,
        message: "Blog not found"
      });    
        }

       await Blog.findByIdAndDelete(id);
        
        res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });   

    } catch (error) {
        res.status(500).json({
      success: false,
      message: error.message
    }); 
    }
})
export default router