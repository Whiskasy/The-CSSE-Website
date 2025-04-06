const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require('path');
//no

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Homepage.html'));
});


app.post('/api/chat', async (req, res) => {
    try {
    console.log("Received POST at /api/chat");
    const userMessage = req.body.userMessage;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-v3-base:free",
            messages: [
                { role: "system", content: "You are a helpful assistant specialized in helping anything related to CSSE courses only. Decline anything else." },
                { role: "user", content: userMessage}
                ]
            })
    })
    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid OpenAI response: " + JSON.stringify(data));
    }
    const botResponse = data.choices[0].message.content;
    res.json({ botResponse });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ botResponse: "Error processing your request."});
    }
});
    


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


