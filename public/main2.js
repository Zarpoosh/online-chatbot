const socket = io();
const clientTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const audio = new Audio("./voice.mp3");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("client total", (data) => {
  console.log(data);
  clientTotal.innerText = `total clients : ${data}`;
});

function sendMessage() {
  if (messageInput === "") return;
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
}

socket.on("chat-message", (data) => {
  console.log(data.message);
  audio.play();
  addMessageToUI(false, data);
});
function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
                    <p class="message">${data.message}</p>
                    <span>${data.name} . ${moment(
    data.dateTime
  ).fromNow()}</span>
                </li>  

    `;

  messageContainer.innerHTML += element;
  messageInput.value = "";
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", () => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing ...`,
  });
});

messageInput.addEventListener("keypress", () => {
  feedback: `${nameInput.value} is typing ...`;
});

messageInput.addEventListener("blure", () => {
  feedback: ``;
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
    <li class="message-feedback">
        <p class="feedback">${data.feedback}</p>
    </li>
  
  `;

  messageContainer.innerHTML += element;
  scrollToBottom()
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
