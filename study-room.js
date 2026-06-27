const seatsLayer = document.getElementById("seatsLayer");

let currentSeat;

const seats = [
{ left: 17, top: 13 },
{ left: 28, top: 13 },
{ left: 39, top: 13 },
{ left: 50, top: 13 },
{ left: 61, top: 13 },
{ left: 72, top: 13 },
{ left: 83, top: 13 },

 // 2열
{ left: 17, top: 33 },
{ left: 28, top: 33 },
{ left: 39, top: 33 },
{ left: 50, top: 33 },
{ left: 61, top: 33 },
{ left: 72, top: 33 },
{ left: 83, top: 33 },

  { left: 17, top: 53 },
  { left: 28, top: 53 },
  { left: 39, top: 53 },
  { left: 50, top: 53 },
  { left: 61, top: 53 },
  { left: 72, top: 53 },
  { left: 83, top: 53 },

  { left: 17, top: 71 },
  { left: 28, top: 71 },
  { left: 39, top: 71 },
  { left: 50, top: 71 },
  { left: 61, top: 71 },
  { left: 72, top: 71 },
  { left: 83, top: 71 },

 // 5열
{ left: 17, top: 93 },
{ left: 28, top: 93 },
{ left: 39, top: 93 },
{ left: 50, top: 93 },
{ left: 61, top: 93 },
{ left: 72, top: 93 },
{ left: 83, top: 93 },
];

function placeCharacterRandomly() {
  const randomIndex = Math.floor(Math.random() * seats.length);
  const seat = seats[randomIndex];
  currentSeat = seat;

  const character = document.createElement("img");
  character.src = "./images/character.png";
  character.className = "character";
  character.alt = "공부 중인 캐릭터";
  setTimeout(function () {
  character.src = "./images/character-fire.png";
}, 30 * 60 * 1000);
setTimeout(function () {
    character.src = "./images/character-crown.png";
}, 2 * 60 * 60 * 1000);
setTimeout(function () {
    character.src = "./images/character-armor.png";
}, 3 * 60 * 60 * 1000);

  character.style.left = `${seat.left+0.3}%`;
  character.style.top = `${seat.top}%`;

  seatsLayer.appendChild(character);
  const studyTimeBadge = document.createElement("div");
studyTimeBadge.className = "study-time-badge";

const totalMinutes = Math.floor(Math.random() * 17) * 30;
const hour = Math.floor(totalMinutes / 60);
const minute = totalMinutes % 60;

studyTimeBadge.textContent = minute === 0 ? `🔥${hour}h` : `🔥${hour}.5h`;

studyTimeBadge.style.left = `${seat.left - 3.8}%`;
studyTimeBadge.style.top = `${seat.top - 7}%`;

seatsLayer.appendChild(studyTimeBadge);
}

placeCharacterRandomly();
const studyRoom = document.querySelector(".study-room");
const goalModal = document.getElementById("goalModal");
const goalInput = document.getElementById("goalInput");
const goalSubmitBtn = document.getElementById("goalSubmitBtn");

studyRoom.classList.add("blurred");

goalSubmitBtn.addEventListener("click", submitGoal);

goalInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    submitGoal();
  }
});

function submitGoal() {
  const goal = goalInput.value.trim();

  if (goal.length === 0) {
    alert("오늘의 목표를 입력해주세요!");
    return;
  }

  if (goal.length > 10) {
    alert("10글자 이내로 입력해주세요!");
    return;
  }

  goalModal.style.display = "none";
  studyRoom.classList.remove("blurred");

  showGoalLabel(goal);
}

function showGoalLabel(goal) {
  const label = document.createElement("div");
  label.className = "goal-label";
  label.textContent = goal;

  label.style.left = `${currentSeat.left + 0.3}%`;
label.style.top = `${currentSeat.top + 5}%`;

  seatsLayer.appendChild(label);
}