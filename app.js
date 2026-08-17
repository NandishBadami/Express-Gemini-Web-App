const { GoogleGenAI } = require('@google/genai');
const express = require('express');
require('dotenv').config();

const app = express();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async(req, res) => {
    if(req.query.prompt) {
        const result = await ai.interactions.create({
            model: 'gemini-3.6-flash',
            input: req.query.prompt
        });
        return res.render('index.ejs', {prompt: req.query.prompt, result: result.output_text})
    } 
    res.render('index.ejs');
});

app.listen(3000, () => console.log('http://localhost:3000'))