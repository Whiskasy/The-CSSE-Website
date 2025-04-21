


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

function appendMessage(sender, message) { // To make the messages appear in the chat window
    const chatLog = document.getElementById("chatLog");
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender.toLowerCase()}`;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

async function fetchBotResponse(userMessage){  // To fetch the bot response from the server
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

async function fetchGitHubRepo(repoName) { // To fetch GitHub repository information
    try {
        const response = await fetch(`https://api.github.com/repos/${repoName}`);
        if (!response.ok) {
            throw new Error("Repository not found");
        }
        const repoData = await response.json();
        const repoInfo = `Repository: ${repoData.full_name}\nDescription: ${repoData.description}\nStars: ${repoData.stargazers_count}\nForks: ${repoData.forks_count}`;
        appendMessage("ChatBot", repoInfo);
    } catch (error) {
        console.error("Error fetching GitHub repository:", error);
        appendMessage("ChatBot", "Sorry, I couldn't fetch the repository details. Please check the repository name and try again.");
    }
}