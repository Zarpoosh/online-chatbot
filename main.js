const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`chat server on port:  ${PORT}`);
});

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", onConnected);

let socketConnected = new Set();

function onConnected(socket) {
  console.log(socket.id);
  console.log(`socket connected : ${socket.id}`);
  socketConnected.add(socket.id);

  io.emit("client total", socketConnected.size);
  socket.on("disconnected", (socket) => {
    console.log(`socket disconnected : ${socket.id}`);

    socketConnected.delete(socket.id);
    io.emit("client total", socketConnected.size);
  });

  socket.on("message", (data) => {
    console.log(`this is from server side: ${data.message}`);
    addMessageToUI()
  });
  function addMessageToUI(isOwnMessage, data) {
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
                    <p class="message">${data.message}</p>
                    <span>${data.name} . ${data.dateTime}</span>
                </li>  

    `

    messageContainer.innerHTML +=element
  }
}
