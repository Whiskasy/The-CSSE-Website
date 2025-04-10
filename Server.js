const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();
const app = express();
const path = require('path');
//no

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
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
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-v3-base:free",
            messages: [
                { role: "system", content: "You are a helpful assistant specialized in helping anything related to CSSE courses only. Respond to prompts unrelated to computer science and software engineering with a message saying you only answer CSSE related prompts." },
                { role: "user", content: userMessage}
                ]
            })
    })
    
    let data;
    try {
    data = await response.json();
    } catch (error) {
    console.error("Error parsing JSON response from OpenRouter API:", error.message);
    return res.status(500).json({ botResponse: "The chatbot encountered an error while parsing JSON response. Please try again later." });
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
        console.warn("Empty or invalid response from OpenRouter API:", JSON.stringify(data));
        return res.json({ botResponse: "I'm sorry, I couldn't process your request. Please try asking something else." });
    }
    const botResponse = data.choices[0].message.content;
    res.json({ botResponse });
    } catch (error) {
        console.error("Server Error:", error.message, error.stack);
        res.status(500).json({ botResponse: "Error processing your request."});
    }
});
    


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


