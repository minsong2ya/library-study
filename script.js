import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2z_oPZdwKT1w205xHs5dRVP8_AIzCC78",
  authDomain: "library-study-b9678.firebaseapp.com",
  projectId: "library-study-b9678",
  storageBucket: "library-study-b9678.firebasestorage.app",
  messagingSenderId: "93674680499",
  appId: "1:93674680499:web:51865432e58e3f23c740c6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const onlineCountRef = doc(db, "studyStatus", "onlineCount");
// 개강일 설정
const startDate = new Date("2026-09-01");

function updateDDay() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diff = startDate - today;
  const dDay = Math.ceil(diff / (1000 * 60 * 60 * 24));

  const dDayText = document.getElementById("dDayText");

  if (dDay > 0) {
    dDayText.textContent = `개강까지 D-${dDay}`;
  } else if (dDay === 0) {
    dDayText.textContent = "오늘 개강!";
  } else {
    dDayText.textContent = "개강 완료";
  }
}

function updateStudyingCount() {
  const studyingText = document.getElementById("studyingText");

  studyingText.textContent = `0명 공부 중`;
}
}

function enterSite() {
  window.location.href = "study-room.html";
}

updateDDay();
updateStudyingCount();