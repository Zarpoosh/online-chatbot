const socket = io();
const clientTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message");
const audio = new Audio("./voice.mp3");

const newGroupNameInput = document.getElementById("new-group-name");
const createGroupBtn = document.getElementById("create-group-btn");
const groupsList = document.getElementById("groups-list");
const activeGroupSelect = document.getElementById("active-group-select");
const fileInput = document.getElementById("file-input"); // المنت انتخاب فایل

const joinedGroups = new Set();
let activeGroup = "";

// ==================== ارسال پیام متنی ====================
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  if (messageInput.value.trim() === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  if (activeGroup) {
    data.groupName = activeGroup;
    socket.emit("group-message", data);
    addMessageToUI(true, data, true);
  } else {
    socket.emit("message", data);
    addMessageToUI(true, data, false);
  }
}

// ==================== ارسال فایل ====================
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // محدودیت حجم 5 مگابایت
  if (file.size > 5 * 1024 * 1024) {
    alert("حجم فایل نباید بیشتر از 5 مگابایت باشد!");
    fileInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = {
      name: nameInput.value,
      message: "", // پیام متنی خالی
      dateTime: new Date(),
      file: {
        name: file.name,
        type: file.type,
        data: evt.target.result // داده Base64
      }
    };

    if (activeGroup) {
      data.groupName = activeGroup;
      socket.emit("group-message", data);
      addMessageToUI(true, data, true);
    } else {
      socket.emit("message", data);
      addMessageToUI(true, data, false);
    }
  };
  reader.readAsDataURL(file);
  fileInput.value = ""; // ریست کردن اینپوت فایل
});


// ==================== دریافت پیام ====================
socket.on("chat-message", (data) => {
  audio.play();
  addMessageToUI(false, data, false);
});

socket.on("group-message", (data) => {
  audio.play();
  addMessageToUI(false, data, true);
});

function addMessageToUI(isOwnMessage, data, isGroup) {
  clearFeedback();
  const badge = isGroup ? ` <small>[${data.groupName}]</small>` : "";
  
  let contentHtml = "";
  
  // اگر فایل داشت
  if (data.file) {
    if (data.file.type.startsWith("image/")) {
      // اگر عکس بود
      contentHtml += `<a href="${data.file.data}" target="_blank"><img src="${data.file.data}" alt="image" class="chat-image"></a>`;
    } else {
      // اگر فایل دیگر بود (PDF, ZIP و...)
      contentHtml += `<a href="${data.file.data}" download="${data.file.name}" class="file-download">
                        <i class="fa-solid fa-file-arrow-down"></i> ${data.file.name}
                      </a>`;
    }
  }
  
  // اگر همراه فایل پیام متنی هم داشت
  if (data.message && data.message.trim() !== "") {
    contentHtml += `<p class="message">${data.message}</p>`;
  }

  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      ${contentHtml}
      <span>${data.name} ${badge} . ${moment(data.dateTime).fromNow()}</span>
    </li>
  `;

  messageContainer.innerHTML += element;
  messageInput.value = "";
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// ==================== تعداد کلاینت‌ها ====================
socket.on("client total", (data) => {
  clientTotal.innerText = `total clients : ${data}`;
});

// ==================== فیدبک تایپینگ ====================
messageInput.addEventListener("focus", () => {
  if (activeGroup) {
    socket.emit("group-feedback", { groupName: activeGroup, feedback: `${nameInput.value} is typing ...` });
  } else {
    socket.emit("feedback", { feedback: `${nameInput.value} is typing ...` });
  }
});

socket.on("feedback", (data) => {
  clearFeedback();
  messageContainer.innerHTML += `<li class="message-feedback"><p class="feedback">${data.feedback}</p></li>`;
  scrollToBottom();
});

socket.on("group-feedback", (data) => {
  if (data.groupName !== activeGroup) return;
  clearFeedback();
  messageContainer.innerHTML += `<li class="message-feedback"><p class="feedback">${data.feedback}</p></li>`;
  scrollToBottom();
});

socket.on("group-system", (data) => {
  if (data.groupName !== activeGroup) return;
  messageContainer.innerHTML += `<li class="message-feedback"><p class="feedback">⚙️ ${data.text}</p></li>`;
  scrollToBottom();
});

socket.on("group-member-update", (data) => {
  const li = document.querySelector(`li[data-group="${data.groupName}"]`);
  if (li) {
    const countSpan = li.querySelector(".member-count");
    if (countSpan) countSpan.innerText = `(${data.memberCount} نفر)`;
  }
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

// ==================== قابلیت گروه‌ها ====================
createGroupBtn.addEventListener("click", () => {
  const groupName = newGroupNameInput.value.trim();
  if (!groupName) return alert("نام گروه را وارد کنید");

  socket.emit("create-group", { groupName, creatorName: nameInput.value }, (res) => {
    if (res.ok) {
      joinedGroups.add(groupName);
      setActiveGroup(groupName);
      newGroupNameInput.value = "";
    } else {
      alert(res.error);
    }
  });
});

socket.on("group-list", (list) => {
  renderGroupsList(list);
});

function renderGroupsList(list) {
  groupsList.innerHTML = "";
  activeGroupSelect.innerHTML = `<option value="">گلوبال (عمومی)</option>`;

  list.forEach((group) => {
    const isJoined = joinedGroups.has(group.name);
    const li = document.createElement("li");
    li.dataset.group = group.name;
    li.innerHTML = `
      <div class="group-row">
        <strong>${group.name}</strong>
        <span class="member-count">(${group.memberCount} نفر)</span>
      </div>
      <div class="group-actions">
        ${isJoined ? `<button class="leave-btn" data-name="${group.name}">خروج</button><button class="enter-btn" data-name="${group.name}">ورود به چت</button>` : `<button class="join-btn" data-name="${group.name}">عضویت</button>`}
      </div>
    `;
    groupsList.appendChild(li);

    if (isJoined) {
      const opt = document.createElement("option");
      opt.value = group.name;
      opt.innerText = group.name;
      activeGroupSelect.appendChild(opt);
    }
  });

  groupsList.querySelectorAll(".join-btn").forEach((btn) => btn.addEventListener("click", () => joinGroup(btn.dataset.name)));
  groupsList.querySelectorAll(".leave-btn").forEach((btn) => btn.addEventListener("click", () => leaveGroup(btn.dataset.name)));
  groupsList.querySelectorAll(".enter-btn").forEach((btn) => btn.addEventListener("click", () => setActiveGroup(btn.dataset.name)));

  activeGroupSelect.value = activeGroup;
}

function joinGroup(groupName) {
  socket.emit("join-group", { groupName, userName: nameInput.value }, (res) => {
    if (res.ok) { joinedGroups.add(groupName); setActiveGroup(groupName); }
    else { alert(res.error); }
  });
}

function leaveGroup(groupName) {
  socket.emit("leave-group", { groupName, userName: nameInput.value }, (res) => {
    if (res.ok) {
      joinedGroups.delete(groupName);
      if (activeGroup === groupName) setActiveGroup("");
    } else { alert(res.error); }
  });
}

function setActiveGroup(groupName) {
  activeGroup = groupName;
  activeGroupSelect.value = groupName;
  messageContainer.innerHTML = "";
  messageContainer.innerHTML += `<li class="message-feedback"><p class="feedback">${groupName ? `📍 شما در گروه "${groupName}" هستید` : "🌐 حالت گلوبال (عمومی)"}</p></li>`;
  scrollToBottom();
}

activeGroupSelect.addEventListener("change", (e) => setActiveGroup(e.target.value));