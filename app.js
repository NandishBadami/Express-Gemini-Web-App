const { GoogleGenAI } = require('@google/genai');
const express = require('express');
require('dotenv').config();

const app = express();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async(req, res) => {
    if(req.query.prompt) {
        try {
            const result = await ai.interactions.create({
                model: 'gemini-3.6-flash',
                input: req.query.prompt
            });
            return res.render('index.ejs', {prompt: req.query.prompt, result: result.output_text})
        } catch (error) {
            console.error("--- REAL GOOGLE ERROR ---");
  
  // The SDK hides the server's real response message here:
  if (error.body) {
    console.error("Server Body Error:", error.body);
  } else {
    console.dir(error, { depth: null });
  }

  res.status(400).json({
    success: false,
    googleSays: error.body ? JSON.parse(error.body) : error.message
  });
        }
    } 
    res.render('index.ejs');
});

app.listen(3000, () => console.log('http://localhost:3000'))