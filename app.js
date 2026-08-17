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
        } catch (err) {
            console.error("--- DETAILED GEMINI ERROR START ---");
            console.dir(error, { depth: null }); 
            console.error("--- DETAILED GEMINI ERROR END ---");

            // 2. Extract specific Google API fields safely
            const apiStatus = error.status || "UNKNOWN_STATUS";
            const apiMessage = error.message || "Generic API Error";
            
            // 3. Send detailed response to your frontend or network tab
            return res.status(400).json({
                success: false,
                error: apiMessage,
                status: apiStatus,
                rawDetails: error.errorDetails || null
            });
        }
    } 
    res.render('index.ejs');
});

app.listen(3000, () => console.log('http://localhost:3000'))