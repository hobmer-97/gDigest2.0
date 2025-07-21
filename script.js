// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDuMSILLzGhAjDB8_DmvZg-qoCU_TcIkUo",
    authDomain: "gdigest-348ec.firebaseapp.com",
    databaseURL: "https://gdigest-348ec-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gdigest-348ec",
    storageBucket: "gdigest-348ec.firebasestorage.app",
    messagingSenderId: "682670428621",
    appId: "1:682670428621:web:f54b22c1b813892fc9f484"
  };


firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userData = { name: "", location: "" };

const welcomeScreen = document.getElementById("welcome-screen");
const inputScreen = document.getElementById("input-screen");
const questionScreen = document.getElementById("question-screen");
const bubbleScreen = document.getElementById("bubble-screen");

welcomeScreen.addEventListener("click", () => {
  document.getElementById("click-to-continue").classList.remove("hidden");
  welcomeScreen.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    inputScreen.classList.remove("hidden");
  });
});

function showQuestion() {
  const name = document.getElementById("name").value.trim();
  const location = document.getElementById("location").value.trim();
  if (name && location) {
    userData.name = name;
    userData.location = location;
    inputScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");
  }
}

function submitAnswer() {
  const text = document.getElementById("answer").value.trim();
  if (!text) return;

  const data = {
    text,
    name: userData.name,
    location: userData.location,
    timestamp: Date.now()
  };

  db.ref("answers").push(data);
  questionScreen.classList.add("hidden");
  bubbleScreen.classList.remove("hidden");
  showBubbles();
}

// Bubble rendering
const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bubbles = [];

function drawBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let b of bubbles) {
    ctx.beginPath();
    ctx.fillStyle = "#d3d3d3"; // light gray
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 14px Arial";
    ctx.fillText(b.text, b.x, b.y - 5);
    ctx.font = "12px Arial";
    ctx.fillText(`${b.name} – ${b.location}`, b.x, b.y + 12);
    b.y -= b.speed;
    if (b.y + b.radius < 0) {
      b.y = canvas.height + b.radius;
    }
  }
  requestAnimationFrame(drawBubbles);
}

function showBubbles() {
  db.ref("answers").on("value", (snapshot) => {
    const data = snapshot.val();
    bubbles = [];
    for (let key in data) {
      let entry = data[key];
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 60,
        speed: 0.3 + Math.random(),
        text: entry.text,
        name: entry.name,
        location: entry.location
      });
    }
  });

  drawBubbles();
}