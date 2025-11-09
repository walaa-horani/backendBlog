import axios from "axios";
import express from "express";
const router = express.Router()

router.post("/generate-comment", async(req,res)=> {
  try {
    const { topic } = req.body;

    const prompt = `Generate exactly 2 short, friendly comment suggestions for a blog about "${topic}". 

Requirements:
- Each comment must be under 15 words
- Output ONLY the 2 comments, one per line
- No numbering, no explanations, no additional text
- Do not ask follow-up questions

Example format:
Great insights on this topic!
Looking forward to reading more about this.`;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "google/gemma-3-4b-it:free",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
    });

    const text = response.data.choices[0].message.content;
    const suggestions = text
  .split("\n")
  .map((line) =>
    line
      .replace(/^\d+\.\s*/, "")       // يحذف الأرقام (1. , 2.)
      .replace(/\*\*/g, "")           // يحذف الـ bold markdown
      .replace(/^>\s?/, "")           // يحذف علامة الاقتباس >
      .replace(/Suggestion\s*\d+:?/gi, "") // يحذف "Suggestion 1:" أو "Suggestion 2:"
      .trim()
  )
  .filter(
    (line) =>
      line &&
      !line.toLowerCase().includes("okay") &&
       !line.toLowerCase().includes("comment") &&
      !line.toLowerCase().includes("suggestions") &&
      !line.toLowerCase().includes("for a blog about")
  );

res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



   export default router;
