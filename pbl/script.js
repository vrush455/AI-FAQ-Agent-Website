
const API_KEY = CHATBASE_API_KEY;        // From config.js
const CHATBOT_ID = CHATBOT_ID;            // From config.js

async function sendMessage() {
  const input = document.getElementById('userInput');
  const query = input.value.trim();
  if (!query) return;

  appendMessage('user', query);
  input.value = '';
  showTypingIndicator();

  try {
    const response = await fetch('https://api.chatbase.co/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatbotId: CHATBOT_ID,
        messages: [{ role: 'user', content: query }]
      })
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    removeTypingIndicator();
    appendMessage('bot', botReply);
  } catch (error) {
    removeTypingIndicator();
    appendMessage('bot', 'Sorry, service is down. Try again.');
    console.error('Chatbase Error:', error);
  }
}


function appendMessage(sender, text) {
  const chatbox = document.getElementById('chatbox');
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'text-right' : 'text-left';
  div.innerHTML = `<p class="${sender}-bubble">${text}</p>`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}


function showTypingIndicator() {
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML += '<p class="bot-bubble">typing...</p>';
}
function removeTypingIndicator() {
  const typing = document.querySelector('.bot-bubble:last-child');
  if (typing && typing.textContent === 'typing...') typing.remove();
}


document.getElementById('userInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
