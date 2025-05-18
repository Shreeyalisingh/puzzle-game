let level = 3;
let timer = 0;
let timerInterval;
const minLevel = 3;

const game = document.getElementById("game");
const nextBtn = document.getElementById("nextLevel");
const prevBtn = document.getElementById("prevLevel");
const timerDisplay = document.getElementById("timer");
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const hintBtn = document.getElementById("hintBtn");
const startBtn = document.getElementById("startBtn");
const gameUI = document.querySelector(".game-ui");

startBtn.addEventListener("click", () => {
  bgMusic.play().catch(() => alert("Please allow audio playback!"));
  startBtn.classList.add("hidden");
  gameUI.classList.remove("hidden");
  createPuzzle(level);
});

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerDisplay.textContent = "00:00";
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = formatTime(timer);
  }, 1000);
}

function createPuzzle(level) {
  game.innerHTML = "";
  nextBtn.disabled = true;

  game.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
  game.style.gridTemplateRows = `repeat(${level}, 1fr)`;

  let positions = Array.from({ length: level * level }, (_, i) => i);
  shuffle(positions);

  for (let i = 0; i < level * level; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.width = `${400 / level}px`;
    tile.style.height = `${400 / level}px`;

    const row = Math.floor(positions[i] / level);
    const col = positions[i] % level;

    tile.style.backgroundPosition = `-${col * (400 / level)}px -${row * (400 / level)}px`;
    tile.dataset.index = positions[i];

    tile.addEventListener("click", () => {
      clickSound.play();
      swapTile(tile);
    });

    game.appendChild(tile);
  }

  prevBtn.disabled = level === minLevel;
  startTimer();
}

let first = null;

function swapTile(tile) {
  if (!first) {
    first = tile;
    tile.classList.add("highlight");
  } else {
    const tmpIndex = tile.dataset.index;
    const tmpBg = tile.style.backgroundPosition;

    tile.dataset.index = first.dataset.index;
    tile.style.backgroundPosition = first.style.backgroundPosition;

    first.dataset.index = tmpIndex;
    first.style.backgroundPosition = tmpBg;

    first.classList.remove("highlight");
    first = null;

    if (isSolved()) {
      clearInterval(timerInterval);
      nextBtn.disabled = false;
      alert(`🎉 Solved in ${formatTime(timer)}!`);
    }
  }
}

function isSolved() {
  const tiles = [...document.querySelectorAll(".tile")];
  return tiles.every((tile, i) => parseInt(tile.dataset.index) === i);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

nextBtn.addEventListener("click", () => {
  level++;
  createPuzzle(level);
});

prevBtn.addEventListener("click", () => {
  if (level > minLevel) {
    level--;
    createPuzzle(level);
  }
});

let hintCount = 0;
const maxHints = 20;

hintBtn.addEventListener("click", () => {
  if (hintCount >= maxHints) {
    alert("No more hints available!");
    return;
  }

  const tiles = Array.from(document.querySelectorAll(".tile"));
  const randomTiles = tiles.sort(() => 0.5 - Math.random()).slice(0, 3);

  randomTiles.forEach(tile => tile.innerText = tile.dataset.index);
  setTimeout(() => randomTiles.forEach(tile => tile.innerText = ""), 1000); // show for 1 second

  hintCount++;
});

const muteBtn = document.getElementById("muteBtn");
muteBtn.addEventListener("click", () => {
  if (bgMusic.muted) {
    bgMusic.muted = false;
    muteBtn.textContent = "🔊 Mute";
  } else {
    bgMusic.muted = true;
    muteBtn.textContent = "🔇 Unmute";
  }
});

const backBtn = document.getElementById("backBtn");




backBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  startBtn.classList.remove("hidden");
  gameUI.classList.add("hidden");
  level = 3; // reset to level 3
  timerDisplay.textContent = "00:00";
});




