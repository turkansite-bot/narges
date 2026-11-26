const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll(".screen")];
const toast = $("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({top: 0, behavior: "smooth"});
}
$("#enterBtn").addEventListener("click", () => {
  showScreen("home");
  burstHearts();
});
document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.open));
});
document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => showScreen("home"));
});

// Count full days since 2 October 2026, using the visitor's local calendar date.
const startDate = new Date(2026, 9, 2);
function updateDays() {
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.max(0, Math.floor((todayLocal - startDate) / 86400000));
  $("#daysCount").textContent = new Intl.NumberFormat("fa-IR").format(days);
}
updateDays();

// Quiz: playful prompts, no score or pressure.
const quizQuestions = [
  {q:"فکر می‌کنی من بیشتر کدومم؟", a:["آدمِ منطقی و بیشعور","آدمِ لحظه‌های غیرمنتظره بیشعور","ترکیبی از هر دو"], reply:"جواب جالبی بود! فعلاً همین‌قدر بگم که همشون یه گوشه‌ای از منن. 😄"},
  {q:"اگه قرار باشه یه قرار ساده انتخاب کنیم، کدوم جذاب‌تره؟", a:["قدم زدن و حرف زدن","کافه و موسیقی آروم","یه ماجراجویی کوچولو"], reply:" انتخابت ثبت شد؛ یه روز حتما  امتحانش میکنیم. البته بعد خوارکی🤗"},
  {q:"حدس می‌زنی چرا این صفحه رو ساختم؟", a:["چون حوصله‌م سر رفته بود!","چون می‌خواستم خوشحالت کنم","چون فرشته‌ منی"], reply:"راستش جواب دوم درسته ؛ سومی هم  درسته تا اینکه خودت هم بدونی فرشته منی البته بعد از ماهی و گل من! 💗"}
];
let questionIndex = 0;
function renderQuestion() {
  const item = quizQuestions[questionIndex];
  $("#quizStep").textContent = `سؤال ${questionIndex + 1} از ${quizQuestions.length}`;
  $("#progressBar").style.width = `${((questionIndex + 1) / quizQuestions.length) * 100}%`;
  $("#questionText").textContent = item.q;
  $("#quizFeedback").textContent = "";
  $("#nextQuestion").classList.add("hidden");
  const answers = $("#answers");
  answers.innerHTML = "";
  item.a.forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => {
      [...answers.children].forEach(child => child.disabled = true);
      button.classList.add("selected");
      $("#quizFeedback").textContent = item.reply;
      $("#nextQuestion").classList.remove("hidden");
    });
    answers.appendChild(button);
  });
}
$("#nextQuestion").addEventListener("click", () => {
  questionIndex++;
  if (questionIndex >= quizQuestions.length) {
    questionIndex = 0;
    showToast("آفرین! حالا یه سورپرایز دیگه هم هست. ♡");
    showScreen("gift");
  } else renderQuestion();
});
renderQuestion();

// Gift reveal.
$("#giftBox").addEventListener("click", () => {
  $("#giftBox").classList.add("open");
  $("#giftMessage").classList.remove("hidden");
  $("#giftBox").setAttribute("aria-label", "جعبه هدیه باز شد");
  burstHearts();
});
$("#giftAgain").addEventListener("click", () => {
  $("#giftBox").classList.remove("open");
  $("#giftMessage").classList.add("hidden");
  $("#giftBox").setAttribute("aria-label", "باز کردن جعبه هدیه");
});

// Wish stars.
document.querySelectorAll("[data-wish]").forEach(star => {
  star.addEventListener("click", () => {
    $("#wishResult").textContent = star.dataset.wish;
    star.animate([{transform:"scale(1)"},{transform:"scale(1.65)"},{transform:"scale(1)"}], {duration:450});
  });
});

// Optional local music. Add your own licensed/royalty-free file at assets/music.mp3.
const music = $("#backgroundMusic");
const musicBtn = $("#musicBtn");
const musicStatus = $("#musicStatus");
let musicAvailable = true;
music.addEventListener("error", () => {
  musicAvailable = false;
  musicStatus.textContent = "برای افزودن موسیقی، فایل خودت رو در assets/music.mp3 بذار";
  musicBtn.disabled = true;
  musicBtn.textContent = "♫";
});
musicBtn.addEventListener("click", async () => {
  if (!musicAvailable) {
    showToast("فایل موسیقی assets/music.mp3 هنوز اضافه نشده.");
    return;
  }
  if (music.paused) {
    try {
      await music.play();
      musicBtn.textContent = "Ⅱ";
      musicStatus.textContent = "در حال پخش موسیقی";
    } catch {
      showToast("پخش موسیقی ممکن نشد؛ فایل موسیقی رو بررسی کن.");
    }
  } else {
    music.pause();
    musicBtn.textContent = "▶";
    musicStatus.textContent = "موسیقی متوقف شد";
  }
});

// Small decorative heart burst, triggered only by the visitor's actions.
function burstHearts() {
  const symbols = ["♡", "✦", "♥"];
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("span");
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    Object.assign(heart.style, {
      position:"fixed", zIndex:8, left:`${12 + Math.random() * 76}%`,
      top:`${35 + Math.random() * 35}%`, color:"#d879a1",
      fontSize:`${14 + Math.random() * 17}px`, pointerEvents:"none",
      transition:"transform 1.2s ease, opacity 1.2s ease", opacity:"1"
    });
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random()-.5)*100}px, -${60+Math.random()*100}px) rotate(${Math.random()*90}deg)`;
      heart.style.opacity = "0";
    });
    setTimeout(() => heart.remove(), 1300);
  }
}

// Canvas starfield, scaled for mobile and high-DPI screens.
const canvas = $("#stars");
const ctx = canvas.getContext("2d");
let starPoints = [];
function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  starPoints = Array.from({length: Math.min(75, Math.floor(window.innerWidth / 5))}, () => ({
    x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
    r:Math.random()*1.4+.3, phase:Math.random()*Math.PI*2
  }));
}
function drawStars(time=0) {
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  starPoints.forEach(star => {
    const alpha = .18 + (Math.sin(time/900 + star.phase)+1)*.22;
    ctx.beginPath(); ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(190,126,157,${alpha})`; ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeStars);
resizeStars();
requestAnimationFrame(drawStars);
