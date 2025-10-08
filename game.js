let lives = 5;
let level = 1;
let score = 0;
let timeLeft = 60;
let currentAnswer = "";
let correctAnswer = 0;
let timerInterval;
let gameActive = false;
let selectedLevel = 1;

function selectLevel(lvl) {
  selectedLevel = lvl;

  // Update visual selection
  const buttons = document.querySelectorAll(".level-btn");
  buttons.forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");

  // Langsung mulai game
  setTimeout(() => {
    startGame();
  }, 300);
}

function startGame() {
  level = selectedLevel;
  document.getElementById("level").textContent = level;
  document.getElementById("startScreen").style.display = "none";
  gameActive = true;
  generateQuestion();
  timerInterval = setInterval(updateTimer, 1000);
}

function getRange(lvl) {
  if (lvl <= 5) return 5;
  if (lvl <= 10) return 10;
  if (lvl <= 15) return 20;
  return 50;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
  const range = getRange(level);
  const operations = ["+", "-", "×"];
  const operation = operations[randomInt(0, operations.length - 1)];
  const questionType = randomInt(1, 3);

  let a, b, answer;

  a = randomInt(-range, range);
  b = randomInt(-range, range);

  if (operation === "+") {
    answer = a + b;
  } else if (operation === "-") {
    answer = a - b;
  } else {
    answer = a * b;
  }

  let questionText;
  if (questionType === 1) {
    questionText = `${a} ${operation} (${b}) = ?`;
    correctAnswer = answer;
  } else if (questionType === 2) {
    questionText = `? ${operation} (${b}) = ${answer}`;
    if (operation === "+") correctAnswer = answer - b;
    else if (operation === "-") correctAnswer = answer + b;
    else correctAnswer = b !== 0 ? Math.round(answer / b) : 0;
  } else {
    questionText = `${a} ${operation} ? = ${answer}`;
    if (operation === "+") correctAnswer = answer - a;
    else if (operation === "-") correctAnswer = a - answer;
    else correctAnswer = a !== 0 ? Math.round(answer / a) : 0;
  }

  document.getElementById("question").textContent = questionText;
}

function addToAnswer(value) {
  if (!gameActive) return;

  if (currentAnswer === "" && value === "-") {
    currentAnswer = "-";
  } else if (value === "-" && currentAnswer !== "" && currentAnswer !== "-") {
    return;
  } else if (currentAnswer.length < 5) {
    currentAnswer += value;
  }

  document.getElementById("answerDisplay").textContent = currentAnswer || "_";
}

function clearAnswer() {
  currentAnswer = "";
  document.getElementById("answerDisplay").textContent = "_";
}

function showFeedback(isCorrect) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = isCorrect ? "✓" : "✗";
  feedback.className = `feedback ${isCorrect ? "correct" : "wrong"} show`;

  setTimeout(() => {
    feedback.classList.remove("show");
  }, 500);
}

function checkAnswer() {
  if (!gameActive || currentAnswer === "" || currentAnswer === "-") return;

  const userAnswer = parseInt(currentAnswer);

  if (userAnswer === correctAnswer) {
    showFeedback(true);
    score += level * 10;
    level++;
    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;

    if (level > 20) {
      endGame();
      return;
    }

    // Reset timer ke 60 detik
    timeLeft = 60;
    document.getElementById("timerFill").style.width = "100%";
    document.getElementById("timerFill").style.background =
      "linear-gradient(90deg, #4CAF50, #8BC34A)";
    document.getElementById("timerText").textContent = "60s";

    clearAnswer();
    generateQuestion();
  } else {
    showFeedback(false);
    lives--;
    updateLives();
    clearAnswer();

    if (lives <= 0) {
      endGame();
    }
  }
}

function updateLives() {
  const livesDisplay = document.getElementById("lives");
  livesDisplay.textContent = "❤️".repeat(lives);
}

function updateTimer() {
  timeLeft--;
  const percentage = (timeLeft / 60) * 100;
  const timerFill = document.getElementById("timerFill");
  const timerText = document.getElementById("timerText");

  timerFill.style.width = percentage + "%";
  timerText.textContent = timeLeft + "s";

  if (timeLeft <= 10) {
    timerFill.style.background = "linear-gradient(90deg, #f44336, #ff5722)";
  }

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOver").style.display = "flex";
}

function restartGame() {
  lives = 5;
  level = 1;
  score = 0;
  timeLeft = 60;
  currentAnswer = "";
  gameActive = false;
  selectedLevel = 1;

  document.getElementById("lives").textContent = "❤️❤️❤️❤️❤️";
  document.getElementById("level").textContent = 1;
  document.getElementById("score").textContent = 0;
  document.getElementById("timerFill").style.width = "100%";
  document.getElementById("timerFill").style.background =
    "linear-gradient(90deg, #4CAF50, #8BC34A)";
  document.getElementById("timerText").textContent = "60s";
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("answerDisplay").textContent = "_";
  document.getElementById("question").textContent = "2 + (-3) = ?";

  // Reset level selector
  const buttons = document.querySelectorAll(".level-btn");
  buttons.forEach((btn) => btn.classList.remove("selected"));
  buttons[0].classList.add("selected");

  // Kembali ke start screen
  document.getElementById("startScreen").style.display = "flex";

  // Clear timer
  clearInterval(timerInterval);
}

function exitGame() {
  if (confirm("Apakah kamu yakin ingin keluar dari game?")) {
    window.location.href = "index.html";
  }
}

document.addEventListener("keypress", function (e) {
  if (!gameActive) return;

  if (e.key >= "0" && e.key <= "9") {
    addToAnswer(e.key);
  } else if (e.key === "Enter") {
    checkAnswer();
  } else if (e.key === "-" || e.key === "+") {
    addToAnswer(e.key);
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    e.preventDefault();
    clearAnswer();
  }
});


