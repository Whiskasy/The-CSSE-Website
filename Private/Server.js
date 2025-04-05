const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.userMessage;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            "content-Type": "application/json",
            "authorization": `Bearer ${process.env.OPEN_AI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant specialized in helping anything related to CSSE courses only. Decline anything else." },
                { role: "user", content: userMessage}
                ]
            })

})
    const data = await response.json();
    const botResponse = data.choices[0].message.content;
    res.json({ botResponse });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

