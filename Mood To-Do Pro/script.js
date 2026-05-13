let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if ("Notification" in window) {
  Notification.requestPermission();
}

function checkDeadlines() {
  const now = new Date();

  tasks.forEach(task => {
    if (!task.date || !task.time || task.notified) return;

    const taskDateTime = new Date(`${task.date}T${task.time}`);

    // Trigger if current time >= task time
    if (now >= taskDateTime) {
      new Notification("⏰ Task Reminder", {
        body: `${task.text} is due now!`
      });

      task.notified = true;
    }
  });

  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateStats();
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  const mood = document.getElementById("moodSelect").value;
  const date = document.getElementById("deadline").value;

  if (!text) return alert("Enter task!");

  const task = {
    id: Date.now(),
    text,
    mood,
    date,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  render();
}

function render() {
  document.querySelectorAll("ul").forEach(ul => ul.innerHTML = "");

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.draggable = true;
    li.id = task.id;

    li.innerHTML = `
      ${task.text} <br>
      📅 ${task.date || "No date"}
      <button onclick="deleteTask(${task.id})">X</button>
    `;

    li.ondragstart = drag;

    document.querySelector(`#${task.mood} ul`).appendChild(li);
  });
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("id", e.target.id);
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("id");

  tasks = tasks.map(t => {
    if (t.id == id) {
      t.mood = e.currentTarget.id;
    }
    return t;
  });

  saveTasks();
  render();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function updateStats() {
  const total = tasks.length;
  const high = tasks.filter(t => t.mood === "high").length;
  const medium = tasks.filter(t => t.mood === "medium").length;
  const low = tasks.filter(t => t.mood === "low").length;

  document.getElementById("stats").innerText =
    `📊 Total: ${total} | ⚡ ${high} | 🌿 ${medium} | 💤 ${low}`;
}

function showTasksByDate() {
  const selected = document.getElementById("calendarDate").value;
  const list = document.getElementById("calendarTasks");

  list.innerHTML = "";

  tasks
    .filter(t => t.date === selected)
    .forEach(t => {
      const li = document.createElement("li");
      li.textContent = t.text;
      list.appendChild(li);
    });
}

render();
updateStats();

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value;
  const mood = document.getElementById("moodSelect").value;
  const date = document.getElementById("deadline").value;
  const time = document.getElementById("time").value;

  if (!text) return alert("Enter task!");

  const task = {
    id: Date.now(),
    text,
    mood,
    date,
    time,
    notified: false
  };

  tasks.push(task);
  saveTasks();
  render();

  // ✅ CLEAR INPUTS
  input.value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("time").value = "";
}

li.innerHTML = `
  ${task.text} <br>
  📅 ${task.date || "No date"} ⏰ ${task.time || "--:--"}
  <button onclick="deleteTask(${task.id})">X</button>
`;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

setInterval(checkDeadlines, 30000); // every 30 seconds