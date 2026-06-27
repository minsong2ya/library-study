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

  // 임시 랜덤 인원수
  const count = Math.floor(Math.random() * 35) + 12;

  studyingText.textContent = `${count}명 공부 중`;
}

function enterSite() {
  window.location.href = "study-room.html";
}

updateDDay();
updateStudyingCount();