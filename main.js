import "./style.css";

let rows, cols, mines;
let board = [];
let gameOver = false;

// افترا به دکمه شروع بازی
document.getElementById("startGameBtn").addEventListener("click", startGame);

// تابع شروع بازی
function startGame() {
  // خواندن مقادیر ورودی از فیلدها
  rows = parseInt(document.getElementById("rows").value);
  cols = parseInt(document.getElementById("cols").value);
  mines = parseInt(document.getElementById("mines").value);

  // فراخوانی توابع مقدماتی برای مقداردهی اولیه و نمایش صفحه بازی
  initializeBoard();
  renderBoard();
}

// تابع مقدماتی مقداردهی اولیه صفحه بازی
function initializeBoard() {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";
  boardContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  board = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // قرار دادن مین‌ها در صفحه بازی
  for (let i = 0; i < mines; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * rows);
      y = Math.floor(Math.random() * cols);
    } while (board[x][y] === "X");
    board[x][y] = "X";
  }
}

// تابع نمایش صفحه بازی
function renderBoard() {
  const boardContainer = document.getElementById("board");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      boardContainer.appendChild(cell);
    }
  }
}

// تابع بررسی کلیک بر روی یک سلول
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  console.log(row,col);

  // بررسی آیا سلول حاوی مین است یا نه
  if (board[row][col] === "X") {
    showMines();
    setTimeout(() => {
      alert("Game over! You hit a mine.");
      initializeBoard();
      renderBoard();
      gameOver = true;
    }, 1000);
  } else {
    // نمایش تعداد مین‌های اطراف و روشن کردن سلول
    revealCell(row, col);
    const mineCount = countAdjacentMines(row, col);
    event.target.textContent = mineCount;
    event.target.style.backgroundColor = "#ddd";

    // اگر تعداد مین‌های اطراف صفر باشد، سلول‌های اطراف را نمایش بده
    if (mineCount === 0) {
      revealAdjacentCells(row, col);
    }
    if (
      !gameOver &&
      document.querySelectorAll(".cell:not(:empty)").length ===
        rows * cols - mines
    ) {
      // اگر تمام سلول‌های غیر از مین‌ها پر شده باشند، بازیکن برنده شده است.
      alert("Congratulations! You won!");
      gameOver = false;
    }
  }
}

// تابع نمایش مین‌ها بر روی صفحه بازی
function showMines() {
  const boardContainer = document.getElementById("board");
  const cells = boardContainer.getElementsByClassName("cell");

  // استفاده از forEach برای گردش در آرایه سلول‌ها
  Array.from(cells).forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (board[row][col] === "X") {
      // نمایش عکس مین به جای متن و تغییر رنگ پس‌زمینه به حالت شفاف
      cell.innerHTML =
        '<img src="src/images/mine.png" alt="" width="100%" height="100%">';
      cell.style.backgroundColor = "transparent";
    }
  });
}

// تابع شمارش تعداد مین‌های اطراف یک سلول
function countAdjacentMines(row, col) {
  // استفاده از reduce به جای یک متغیر count
  return [-1, 0, 1].reduce((count, i) => {
    return (
      count +
      [-1, 0, 1].reduce((innerCount, j) => {
        const newRow = row + i;
        const newCol = col + j;

        // بررسی مرزها و شمارش مین‌های اطراف
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          if (board[newRow][newCol] === "X") {
            innerCount++;
          }
        }
        return innerCount;
      }, 0)
    );
  }, 0);
}

// تابع نمایش یک سلول
function revealCell(row, col) {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.style.backgroundColor = "#ddd";
}

// تابع نمایش سلول‌های اطراف با تعداد مین‌های اطراف صفر
function revealAdjacentCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      // بررسی مرزها و نمایش سلول اگر حاوی مین نباشد
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (board[newRow][newCol] !== "X") {
          revealCell(newRow, newCol);
        }
      }
    }
  }
}