// asyn function so that we can use await inside it
async function sendMessage(){
    const inputField = document.getElementById("inputField");
    const userMessage = inputField.value.trim();
    if (userMessage === "") {
        return;
    }

    appendMessage("User", userMessage);
    inputField.value = ""; // to clear the input field

    const botResponse = await callBotAPI(userMessage);
    appendMessage("ChatBot", botResponse);
}

function appendMessage(sender, message) {
    const chatLog = document.getElementById("chatLog");
    const messageElement = document.createElement("div");
    messageElement.className = "message " + sender.toLowerCase();
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.scrollTop = chatLog.scrollHeight;
}

async function fetchBotResponse(userMessage){
    const response = await fetch("/api/chat",{
        method: "POST",
        headers: {
            "content-Type": "application/json",
        },
        body: JSON.stringify({userMessage}),
    });
    const data = await response.json();
    return data.botResponse;
}