import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  remove,
  onDisconnect,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2z_oPZdwKT1w205xHs5dRVP8_AIzCC78",
  authDomain: "library-study-b9678.firebaseapp.com",
  databaseURL: "https://library-study-b9678-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "library-study-b9678",
  storageBucket: "library-study-b9678.firebasestorage.app",
  messagingSenderId: "93674680499",
  appId: "1:93674680499:web:51865432e58e3f23c740c6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const seatsLayer = document.getElementById("seatsLayer");

let currentSeat;
let currentSeatIndex = -1;
let hasJoined = false;
let userRef = null;

const renderedUsers = {};

const userId =
  sessionStorage.getItem("studyUserId") ||
  crypto.randomUUID();

sessionStorage.setItem("studyUserId", userId);

const seats = [
  { left: 17, top: 13 }, { left: 28, top: 13 }, { left: 39, top: 13 },
  { left: 50, top: 13 }, { left: 61, top: 13 }, { left: 72, top: 13 },
  { left: 83, top: 13 },

  { left: 17, top: 33 }, { left: 28, top: 33 }, { left: 39, top: 33 },
  { left: 50, top: 33 }, { left: 61, top: 33 }, { left: 72, top: 33 },
  { left: 83, top: 33 },

  { left: 17, top: 53 }, { left: 28, top: 53 }, { left: 39, top: 53 },
  { left: 50, top: 53 }, { left: 61, top: 53 }, { left: 72, top: 53 },
  { left: 83, top: 53 },

  { left: 17, top: 71 }, { left: 28, top: 71 }, { left: 39, top: 71 },
  { left: 50, top: 71 }, { left: 61, top: 71 }, { left: 72, top: 71 },
  { left: 83, top: 71 },

  { left: 17, top: 93 }, { left: 28, top: 93 }, { left: 39, top: 93 },
  { left: 50, top: 93 }, { left: 61, top: 93 }, { left: 72, top: 93 },
  { left: 83, top: 93 }
];

async function placeCharacterRandomly() {
  const onlineUsersRef = ref(database, "onlineUsers");
  const snapshot = await get(onlineUsersRef);

  const onlineUsers = snapshot.val() || {};

  const usedSeats = Object.values(onlineUsers)
    .map((user) => user.seat)
    .filter((seat) => seat !== undefined);

  const availableSeats = seats
    .map((seat, index) => ({ seat, index }))
    .filter((item) => !usedSeats.includes(item.index));

  if (availableSeats.length === 0) {
    alert("빈 좌석이 없습니다.");
    return;
  }

  const randomItem =
    availableSeats[Math.floor(Math.random() * availableSeats.length)];

  currentSeatIndex = randomItem.index;
  currentSeat = randomItem.seat;
}
function renderUser(userId, userData) {
  if (renderedUsers[userId]) return;

  const seat = seats[userData.seat];
  if (!seat) return;

  const character = document.createElement("img");
  character.src = "./images/character.png";
  character.className = "character";
  character.alt = "공부 중인 캐릭터";

  character.style.left = `${seat.left + 0.3}%`;
  character.style.top = `${seat.top}%`;

  const studyTimeBadge = document.createElement("div");
  studyTimeBadge.className = "study-time-badge";
  studyTimeBadge.textContent = "";

  studyTimeBadge.style.left = `${seat.left - 3.8}%`;
  studyTimeBadge.style.top = `${seat.top - 7}%`;

  const goalLabel = document.createElement("div");
  goalLabel.className = "goal-label";
  goalLabel.textContent = userData.goal || "";

  goalLabel.style.left = `${seat.left + 0.3}%`;
  goalLabel.style.top = `${seat.top + 5}%`;

  seatsLayer.appendChild(character);
  seatsLayer.appendChild(studyTimeBadge);
  seatsLayer.appendChild(goalLabel);

  renderedUsers[userId] = {
    character,
    studyTimeBadge,
    goalLabel,
    joinedAt: userData.joinedAt,
  };

  updateStudyTimes();
}
}
function removeUser(userId) {
  const userElements = renderedUsers[userId];

  if (!userElements) return;

  userElements.character.remove();
  userElements.studyTimeBadge.remove();
  userElements.goalLabel.remove();

  delete renderedUsers[userId];
}
function updateStudyTimes() {
  Object.values(renderedUsers).forEach((user) => {
    if (!user.joinedAt) return;

    const joined =
      typeof user.joinedAt === "number"
        ? user.joinedAt
        : Date.now();

    const elapsedMinutes = Math.floor((Date.now() - joined) / 10000) * 30;

    const hour = Math.floor(elapsedMinutes / 60);
    const minute = elapsedMinutes % 60;

    user.studyTimeBadge.textContent =
      minute >= 30 ? `🔥${hour}.5h` : `🔥${hour}h`;
  });
}

setInterval(updateStudyTimes, 1000);

setInterval(updateStudyTimes, 1000);
function watchOnlineUsers() {
  const onlineUsersRef = ref(database, "onlineUsers");

  onValue(onlineUsersRef, function (snapshot) {
    const onlineUsers = snapshot.val() || {};

    Object.keys(onlineUsers).forEach(function (userId) {
      renderUser(userId, onlineUsers[userId]);
    });

    Object.keys(renderedUsers).forEach(function (userId) {
      if (!onlineUsers[userId]) {
        removeUser(userId);
      }
    });
  });
}

async function joinStudyRoom(goal) {
  if (hasJoined) return;

  hasJoined = true;
  userRef = ref(database, `onlineUsers/${userId}`);

  await set(userRef, {
    goal: goal,
    seat: currentSeatIndex,
    joinedAt: Date.now()
  });

  onDisconnect(userRef).remove();

  console.log("Realtime 접속 등록 성공");
}


const studyRoom = document.querySelector(".study-room");
const goalModal = document.getElementById("goalModal");
const goalInput = document.getElementById("goalInput");
const goalSubmitBtn = document.getElementById("goalSubmitBtn");

async function init() {
  await placeCharacterRandomly();

  const savedGoal = sessionStorage.getItem("studyGoal");

  if (savedGoal) {
    goalModal.style.display = "none";
    studyRoom.classList.remove("blurred");
    await joinStudyRoom(savedGoal);
  } else {
    studyRoom.classList.add("blurred");
  }

  watchOnlineUsers();
}

init();

goalSubmitBtn.addEventListener("click", submitGoal);

goalInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    submitGoal();
  }
});

async function submitGoal() {
  const goal = goalInput.value.trim();

  if (goal.length === 0) {
    alert("오늘의 목표를 입력해주세요!");
    return;
  }

  if (goal.length > 10) {
    alert("10글자 이내로 입력해주세요!");
    return;
  }

  sessionStorage.setItem("studyGoal", goal);

  goalModal.style.display = "none";
  studyRoom.classList.remove("blurred");

  await joinStudyRoom(goal);
}

function showGoalLabel(goal) {
  const label = document.createElement("div");
  label.className = "goal-label";
  label.textContent = goal;

  label.style.left = `${currentSeat.left + 0.3}%`;
  label.style.top = `${currentSeat.top + 5}%`;

  seatsLayer.appendChild(label);
}