import { db, auth } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

const chatSupportButton = document.getElementById("chat-support-btn");

const chatSupportConfig = await getDoc(doc(db, "chatSupport", "config"));
const API_KEY = chatSupportConfig.data()["CHATGPT_API_KEY"];
const API_URL = "https://api.openai.com/v1/chat/completions";

document
  .getElementById("chat-support-btn")
  .addEventListener("click", function () {
    document.getElementById("chat-popup").style.display = "block";
    loadMessages();
  });
document.getElementById("close-chat").addEventListener("click", function () {
  document.getElementById("chat-popup").style.display = "none";
});
document
  .getElementById("send-message")
  .addEventListener("click", async function () {
    const input = document.getElementById("chat-input");
    const messageText = input.value.trim();
    if (messageText !== "") {
      addMessage(messageText, "user");
      input.value = "";
      saveMessages();
      await getBotResponse(messageText);
    }
  });

function addMessage(text, sender) {
  const messageContainer = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  if (sender === "user") {
    messageElement.classList.add("user-message");
  } else {
    messageElement.classList.add("bot-message");
  }
  messageElement.textContent = text;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function saveMessages() {
  const messages = [];
  document.querySelectorAll(".chat-message").forEach((msg) => {
    messages.push({
      text: msg.textContent,
      sender: msg.classList.contains("user-message") ? "user" : "bot",
    });
  });
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function loadMessages() {
  const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
  console.log(storedMessages);
  storedMessages.forEach((msg) => addMessage(msg.text, msg.sender));
}

async function getBotResponse(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    addMessage(botReply, "bot");
    saveMessages();
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    addMessage("Error getting response. Try again later.", "bot");
  }
}
