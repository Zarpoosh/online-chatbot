
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`chat server on port:  ${PORT}`);
});

// افزایش حجم مجاز برای ارسال فایل (مثلا 10 مگابایت)
const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e8 // 100 MB
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", onConnected);

let socketConnected = new Set();
const groups = new Map();

function getPublicGroupList() {
  const list = [];
  for (const [name, group] of groups.entries()) {
    list.push({ name: group.name, memberCount: group.members.size, createdAt: group.createdAt });
  }
  return list;
}

function broadcastGroupList() {
  io.emit("group-list", getPublicGroupList());
}

function onConnected(socket) {
  socketConnected.add(socket.id);
  io.emit("client total", socketConnected.size);
  socket.emit("group-list", getPublicGroupList());

  socket.on("disconnect", () => {
    socketConnected.delete(socket.id);
    for (const [groupName, group] of groups.entries()) {
      if (group.members.has(socket.id)) {
        group.members.delete(socket.id);
        io.to(groupName).emit("group-member-update", { groupName, memberCount: group.members.size });
        if (group.members.size === 0) groups.delete(groupName);
      }
    }
    io.emit("client total", socketConnected.size);
    broadcastGroupList();
  });

  // پیام عمومی (شامل فایل هم میشه)
  socket.on("message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });

  // ====================== قابلیت‌های گروه ======================
  socket.on("create-group", (data, callback) => {
    const groupName = (data && data.groupName || "").trim();
    if (!groupName) return callback && callback({ ok: false, error: "نام گروه الزامی است" });
    if (groups.has(groupName)) return callback && callback({ ok: false, error: "این گروه از قبل وجود دارد" });
    
    groups.set(groupName, { name: groupName, members: new Set([socket.id]), createdAt: new Date() });
    socket.join(groupName);
    callback && callback({ ok: true, groupName });
    broadcastGroupList();
    socket.to(groupName).emit("group-system", { groupName, text: `${data.creatorName || "کاربر"} گروه را ایجاد کرد` });
  });

  socket.on("join-group", (data, callback) => {
    const groupName = (data && data.groupName || "").trim();
    const group = groups.get(groupName);
    if (!group) return callback && callback({ ok: false, error: "گروه یافت نشد" });
    
    group.members.add(socket.id);
    socket.join(groupName);
    callback && callback({ ok: true, groupName });
    io.to(groupName).emit("group-system", { groupName, text: `${data.userName || "کاربر"} به گروه پیوست` });
    io.to(groupName).emit("group-member-update", { groupName, memberCount: group.members.size });
    broadcastGroupList();
  });

  socket.on("leave-group", (data, callback) => {
    const groupName = (data && data.groupName || "").trim();
    const group = groups.get(groupName);
    if (!group) return callback && callback({ ok: false, error: "گروه یافت نشد" });

    group.members.delete(socket.id);
    socket.leave(groupName);

    if (group.members.size === 0) {
      groups.delete(groupName);
    } else {
      io.to(groupName).emit("group-system", { groupName, text: `${data.userName || "کاربر"} گروه را ترک کرد` });
      io.to(groupName).emit("group-member-update", { groupName, memberCount: group.members.size });
    }
    callback && callback({ ok: true });
    broadcastGroupList();
  });

  // پیام گروهی (شامل فایل هم میشه)
  socket.on("group-message", (data) => {
    const group = groups.get(data.groupName);
    if (!group || !group.members.has(socket.id)) return;
    socket.to(data.groupName).emit("group-message", { ...data, dateTime: new Date() });
  });

  socket.on("group-feedback", (data) => {
    socket.to(data.groupName).emit("group-feedback", data);
  });
}