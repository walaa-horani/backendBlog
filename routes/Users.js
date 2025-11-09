import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router()



function setAuthCookie(res,token){
    res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    })
}


router.post("/register", async(req,res)=> {
    try {

    const {name, email, password} = req.body
    const hashedPassword  = await bcrypt.hash(password,10)
        

     // Check if user exists
     
     const existingUser = await User.findOne({email})
       if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

     // Create new user

     const user = await User.create({name, email, password:hashedPassword})

      await user.save()


      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
       expiresIn:"7d"
      })


      setAuthCookie(res, token)
     res.status(201).json({
        success:true,
         message: 'Registration successful',
        user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } 
     })

        
    } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });    
    }
   

})

router.post("/login", async(req,res)=> {
    try {
      const {email, password} = req.body
      const user =  await User.findOne({email})  
        if(!user) return res.status(404).json({error:"user Not Found"})   
            
    const isMatch = await  bcrypt.compare(password, user.password)
    
      if (!isMatch) return res.status(400).json({error:"invalid Password"})


       const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
                expiresIn:"7d"
            })


       setAuthCookie(res, token);   

     res.status(201).json({message:"User logged in Successfully",
        user: {id:
            
          user._id,
          
          name:user.name ,
          
          email:user.email
        
        }
        
     })   

    } catch (error) {
    res.status(500).json({ error: error.message });          
    }
})


// Get Current User



router.post("/logout", async(req,res)=> {
  res.clearCookie("token"  ,{
      httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

  })
    res.json({ success: true, message: "Logged out successfully" }); // Add this line

})



router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user.id comes from the decoded JWT token
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



router.get("/:id", async(req,res)=> {
    try {
        const user = await User.findById(req.params.id).select("-password")
     if(!user) return res.status(404).json({error:"user not found"}) 
        
        res.json(user)
    } catch (error) {
     res.status(500).json({ error: error.message });     
    }
})
export default router