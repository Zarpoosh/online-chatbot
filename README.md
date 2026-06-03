```markdown
# 💬 Real-Time Chat Application

A real-time chat application built with **Node.js, Express, Socket.IO**, and vanilla **HTML/CSS/JavaScript** on the client side. Users can join with a custom name, send text messages, see when others are typing, and view the total number of online users.

---

## ✨ Features

- 📡 **Real-time messaging** – no page refresh required
- 👤 **Custom username** (default: anonymous)
- 🟢 **Live online user counter**
- ⌨️ **"Someone is typing..." indicator** while others are writing
- 🔊 **Sound notification** for incoming messages
- 📅 **Relative timestamps** (e.g., "2 minutes ago") using Moment.js
- 📱 **Fully responsive design** – works on mobile & desktop
- 🎨 **Visual distinction** between sent and received messages (left/right alignment)

---

## 🛠️ Technologies Used

| Area         | Technologies                                                          |
| ------------ | --------------------------------------------------------------------- |
| Backend      | Node.js, Express.js, Socket.IO                                        |
| Frontend     | HTML5, CSS3, Vanilla JavaScript                                       |
| Libraries    | Socket.IO Client, Moment.js, Font Awesome 7, Google Fonts (Open Sans) |
| Architecture | Modular (EventEmitter ready for logging extensions)                   |

---

## 📁 Project Structure

```‍‍‍‍‍‍‍

chat-application/
│
├── public/ # Client-side files
│ ├── index.html # Main chat page
│ ├── main.css # Styles
│ ├── main2.js # Client logic (socket connection)
│ └── voice.mp3 # Notification sound
│
├── server.js # Express + Socket.IO server
├── logger.js # Logging module with EventEmitter
├── package.json # Dependencies
└── README.md # This file

````

---
<img width="1864" height="961" alt="Screenshot from 2026-06-03 21-43-38" src="https://github.com/user-attachments/assets/337f26c3-bd91-4d94-96af-2b5ef021c246" />


## 🚀 How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) version 14 or higher
- npm (comes with Node.js)

### Steps

1. **Clone the repository** (or download the files)

   ```bash
   git clone https://github.com/Zarpoosh/online-chatbot.git
   cd online-chatbot


2. **Install dependencies**

   ```bash
   npm install express socket.io moment
   ```

   **Or if you have a package.json:**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   node server.js
   ```

4. **Open in your browser**

   Go to:

   ```
   http://localhost:4000
   ```

   > 💡 To test multiple users, open several tabs or different browsers.

   > **Note:** The default port is `4000`. You can change it by setting the `PORT` environment variable.

---

## 🧠 How It Works (Technical Summary)

### 1. Client-Server Connection

When a user opens the page, the browser establishes a persistent connection with the server using **Socket.IO**. The server assigns a unique `id` to each connection and stores it in a `Set` called `socketConnected`.

### 2. Online User Count

Every time a user connects or disconnects, the server calculates the total number of active connections and emits the `client total` event to **all** clients using `io.emit()`. The chat page displays this number in real time.

### 3. Sending a Message

- The user types a message and clicks the send button.
- The client emits a `message` event to the server (including the sender's name, message text, and timestamp).
- The server uses `socket.broadcast.emit("chat-message", data)` to send the message to **everyone except the sender**.
- Recipients receive the message, play a sound notification, and display it on their screen.

### 4. Displaying My Own Message

To show the sender their own message immediately (without waiting for the server to bounce it back), the client directly calls `addMessageToUI(true, data)`. The `isOwnMessage = true` flag positions the message on the right with a distinct style.

### 5. Typing Indicator

- When the user focuses on the message input or presses a key, the client emits a `feedback` event.
- The server broadcasts it to other users.
- Each client clears any existing feedback before showing a new one, ensuring only one "is typing..." message appears at a time.

### 6. Disconnection

When a user closes the tab or turns off their browser, the server detects the `disconnect` event, removes the user from the online set, and broadcasts the updated count to all remaining clients.

---

## 📌 Important Technical Notes

- **No message persistence**: Messages are not stored in any database. They exist only in memory and are visible only to currently connected users. Refreshing the page clears all previous messages.
- **Broadcast pattern**: The server sends messages only to _other_ users, not back to the sender (prevents duplicate messages).
- **Moment.js**: Used to display human-readable timestamps (e.g., "5 seconds ago") instead of raw timestamps.
- **logger.js module**: A simple class that extends EventEmitter – ready to be extended for advanced logging (currently only logs to console).

---

## 🔧 Possible Future Improvements

- [ ] Persist messages in MongoDB or PostgreSQL
- [ ] Add chat rooms
- [ ] Support image and file sharing
- [ ] User authentication (JWT or sessions)
- [ ] Show which specific users are online
- [ ] Emoji support

---

## 🐛 Troubleshooting

| Issue                       | Solution                                                                 |
| --------------------------- | ------------------------------------------------------------------------ |
| `Error: Cannot find module` | Run `npm install` to install all dependencies                            |
| Port `4000` already in use  | Change the port in `server.js` or use `PORT=3000 node server.js`         |
| Messages not sending        | Check browser console for errors and ensure Socket.IO is loaded properly |
| Sound not playing           | Some browsers block autoplay. Click anywhere on the page first           |

---

## 📝 Summary (For Professor Submission)

In this project, I implemented a **real-time, live chat application** that includes:

1. An **HTTP server with Express** and **Socket.IO** integration for bidirectional communication.
2. Connection management and live online user counting.
3. Sending and receiving messages using `message` and `chat-message` events.
4. A **Typing Indicator** feature that shows when another user is typing.
5. Modern JavaScript practices (using `Set` for connections, arrow functions, destructuring).
6. An **EventEmitter-based logging module** for extensibility.
7. A **responsive frontend** with smooth UX (auto-scroll, sound notifications, relative timestamps).

This project serves as a complete foundation for understanding **WebSocket** and **real-time communication** on the web, and it can be extended into a full-featured chat application with database storage and additional capabilities.

---

## 📄 License

This project was developed for educational purposes. Free use with attribution is permitted.

---

**Developer:** [Minoo Zarpoosh]  
**GitHub:** [Zarpoosh](https://github.com/Zarpoosh)  
**Submission Date:** June 2026

```

````
