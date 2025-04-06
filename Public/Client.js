


// asyn function so that we can use await inside it
async function sendMessage(){
    const inputField = document.getElementById("user-input");
    const userMessage = inputField.value.trim();
    if (!userMessage) return;
    
    appendMessage("User", userMessage);
    inputField.value = ""; // to clear the input field
    try {
        const botResponse = await fetchBotResponse(userMessage);
        appendMessage("ChatBot", botResponse);
    } catch (error) {
        console.error("Error fetching bot response:", error);
        appendMessage("ChatBot", "Sorry, I couldn't get a response from the server. Please try again later.");
    }
}

function appendMessage(sender, message) {
    const chatLog = document.getElementById("chatLog");
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender.toLowerCase()}`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

async function fetchBotResponse(userMessage){
    const response = await fetch("http://localhost:3000/api/chat",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userMessage}),
    });
    const data = await response.json();
    return data.botResponse;
}