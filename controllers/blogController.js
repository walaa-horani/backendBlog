import express from "express";
const router = express.Router()

import axios from 'axios';




router.post("/generate", async(req,res)=> {
 try {
        const {prompt} = req.body

         if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }
    console.log("🔑 OpenRouter key:", process.env.OPENROUTER_API_KEY);


   const resAi = await axios.post("https://openrouter.ai/api/v1/chat/completions", {

     "model": "google/gemma-3-27b-it:free",
    "messages": [
      {
        "role": "user",
        "content": `Write a detailed blog post about: ${prompt}. Include an engaging introduction, main content with subheadings, and a conclusion. Make it informative and well-structured.`
      }
    ]
 },

 {


  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
   
    "Content-Type": "application/json"
  },
   }
   
  



);

const generatedContent = resAi.data.choices[0].message.content;

res.status(200).json({
    success:true,
     content: generatedContent
})
    } catch (error) {
    if (error.response) {
  console.error("🔴 AI Generation Error Response:");
  console.error("Status:", error.response.status);
  console.error("Headers:", error.response.headers);
  console.error("Data:", error.response.data);
} else if (error.request) {
  console.error("🟡 No response received from OpenRouter:");
  console.error(error.request);
} else {
  console.error("⚠️ Error in request setup:", error.message);
}

     res.status(500).json({
       success: false, 
      message: 'Failed to generate AI content',
      error: error.message  
     })
    }

})
   export default router;
