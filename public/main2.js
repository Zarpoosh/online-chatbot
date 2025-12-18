const socket = io();
const clientTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("client total", (data) => {
  console.log(data);
  clientTotal.innerText = `total clients : ${data}`;
});

function sendMessage() {
  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    mesage: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true,data)
}
