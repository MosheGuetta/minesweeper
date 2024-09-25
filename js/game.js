"use strict";

const TIMER_INTERVAL = 31; // how ofen the timer updataes. with prime number
//                              we can see all of the milseconds
const INITIAL_TIMER_TEXT = "000"; // the way the timer will look like

const BOMB = "💣";
const REGULAR_HINT = "🤔";
const USED_HINT = "🤐";

let gLevel = {
  SIZE: 4,
  BOMBS: 2,
};

let gGame = {
  isOn: false,
  shownCount: 0, // cell that the player clicked on and were not bombs
  markedCount: 0, // marked with flags
  timePassed: 0,
  lives: 1,
  isHintActive: false,
  numOfHints: 1,
  usedHints: 0,
};

let gBoard = [];
let gBombsCount;
let gTimerInterval; // holds the interval
let gStartTime; // what time the game strats

function onInit() {
  clearInterval(gTimerInterval);
  gStartTime = null; // reset the time

  var elTimer = document.querySelector(".timer");
  elTimer.innerText = INITIAL_TIMER_TEXT;

  document.querySelector(".restart").innerText = REGULAR_HINT;

  gGame.isOn = true;
  gGame.shownCount = 0; // reset the cells the player clicked on
  gGame.markedCount = 0; // reset the cells the player set flag

  buildBoard();
  updateBombCounter();
  updateLives();
  updateHints();
}

function buildBoard() {
  var boardSize = gLevel.SIZE;
  gBoard = [];

  for (var i = 0; i < boardSize; i++) {
    gBoard[i] = [];
    for (var j = 0; j < boardSize; j++) {
      let currCell =
        // each cell in the board will have:
        {
          minesAroundCount: 0, // negs that are bombs
          isShown: false, // if the cell was clicked or not
          isBomb: false, // if the cell is a bombs
          isMarked: false, // if the cell has a flag
        };

      gBoard[i][j] = currCell;
    }
  }

  renderBoard();
}

function renderBoard() {
  var strHTML = "<table>";

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += "<tr>";

    for (var j = 0; j < gBoard.length; j++) {
      let cellClass = "";

      if (gBoard[i][j].isShown) {
        cellClass = "shown"; // if the cell was clicked we had the shown class
      }

      strHTML += ` 
                <td 
                    class="cell-${i}-${j} ${cellClass}" 
                    onclick="onCellClicked(this, ${i}, ${j})"
                    oncontextmenu="onCellMarked(event, this, ${i}, ${j})">
                </td>`;
    }
    strHTML += "</tr>";
  }

  strHTML += "</table>";
  document.querySelector(".card-game").innerHTML = strHTML;
}

function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return; // Stop if the game is over

  const currCell = gBoard[i][j];

  // If the cell is already shown or marked, do nothing
  if (currCell.isShown || currCell.isMarked) return;

  if (gGame.isHintActive) {
    showCellForSecond(i, j);
    gGame.isHintActive = false;
    // gGame.numOfHints--
    updateHints();
    return;
  }

  // First click: Place bombs and start the timer
  if (!gStartTime) {
    startTimer();
    placeBombs(i, j); // Place bombs after the first click, excluding this cell
  }

  // Case 1: If the clicked cell is a bomb, reveal all bombs and end the game
  // TO DO: ADD LIVES
  if (currCell.isBomb) {
    gGame.lives--;
    gLevel.BOMBS--;
    updateLives();
    updateBombCounter();

    currCell.isShown = true;
    elCell.classList.add("shown");
    elCell.innerText = BOMB;

    if (gGame.lives === 0) {
      showBombs();
      return;
    } else {
      alert(`You hit a bomb, you have ${gGame.lives} lives`);
      return;
    }
  }

  // Case 2: Reveal the current cell
  currCell.isShown = true;
  gGame.shownCount++;
  elCell.classList.add("shown");
  elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : "";

  // Case 3: If the cell has no neighboring bombs, recursively reveal neighbors
  if (currCell.negBombsCount === 0) {
    expandShown(i, j); // Recursively reveal neighboring cells
  }

  // Check if the player won the game
  checkGameOver();
}

function expandShown(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue; // Skip the original cell

      if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[i].length)
        continue; // check borders

      const currCell = gBoard[i][j];
      const elCell = document.querySelector(`.cell-${i}-${j}`);

      // Only reveal unshown, unmarked, non-bomb cells
      if (!currCell.isShown && !currCell.isBomb && !currCell.isMarked) {
        currCell.isShown = true;
        gGame.shownCount++;
        elCell.classList.add("shown");
        elCell.innerText =
          currCell.negBombsCount > 0 ? currCell.negBombsCount : "";

        // Recursively expand only if the current cell has no neighboring bombs
        if (currCell.negBombsCount === 0) {
          expandShown(i, j); // Recursion for empty cells
        }
      }
    }
  }
}

function showCellForSecond(cellI, cellJ) {
  const cellsToShow = [];

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard.length) continue; // out of borders
      const currCell = gBoard[i][j];

      if (!currCell.isShown) {
        cellsToShow.push({
          cell: currCell,
          elCell: document.querySelector(`.cell-${i}-${j}`),
        });
        currCell.isShown = true;
        const elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.classList.add("shown");
        elCell.innerText = currCell.isBomb
          ? BOMB
          : currCell.negBombsCount > 0
          ? currCell.negBombsCount
          : "";
      }
    }
  }

  setTimeout(() => {
    cellsToShow.forEach(({ cell, elCell }) => {
      cell.isShown = false;
      elCell.classList.remove("shown");
      elCell.innerText = "";
    });

    gGame.isHintActive = false;
  }, 1000);
}

function checkGameOver() {
  let totalCells = gBoard.length * gBoard[0].length;
  let nonBombCells = totalCells - gLevel.BOMBS;

  if (gGame.shownCount === nonBombCells) {
    showAllCells();

    document.querySelector(".restart").innerText = "😎";

    setTimeout(() => {
      alert("You won!");

      gGame.isOn = false;
      clearInterval(gTimerInterval);
    }, 100);
  }
}

function updateLives() {
  const elLives = document.querySelector(".lives");
  let livesHTML = "";

  for (var i = 0; i < gGame.lives; i++) {
    livesHTML += "💛";
  }

  elLives.innerHTML = livesHTML;
}

function updateHints() {
  const elHints = document.querySelector(".hints");
  let hintsHTML = "";

  for (let i = 0; i < gGame.numOfHints; i++) {
    if (i < gGame.usedHints) {
      // Render used hints
      hintsHTML += `<span class="hint used-hint">${USED_HINT}</span> `;
    } else {
      // Render unused hints
      hintsHTML += `<span class="hint" onclick="activateHint(this)">${REGULAR_HINT}</span> `;
    }
  }

  elHints.innerHTML = hintsHTML;
}

function activateHint(elHint) {
  if (!gGame.isHintActive && gGame.numOfHints > gGame.usedHints) {
    elHint.innerText = USED_HINT;
    elHint.classList.add("used-hint");
    elHint.onclick = null;
    gGame.usedHints++;
    gGame.isHintActive = true;
  }
}

function showAllCells() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const currCell = gBoard[i][j];

      if (!currCell.isBomb && !currCell.isShown) {
        const elCell = document.querySelector(`.cell-${i}-${j}`);
        currCell.isShown = true;
        elCell.classList.add("shown");
        elCell.innerText =
          currCell.negBombsCount > 0 ? currCell.negBombsCount : "";
      }
    }
  }
}

function onCellMarked(event, elCell, i, j) {
  event.preventDefault(); // remove the regular right click actionnnnnn

  if (!gGame.isOn) return;
  const currCell = gBoard[i][j];

  if (currCell.isShown) return;

  currCell.isMarked = !currCell.isMarked;

  if (currCell.isMarked) {
    elCell.innerText = "🚩";
    gGame.markedCount++;
  } else {
    elCell.innerText = "";
    gGame.markedCount--;
  }

  updateBombCounter();
  checkGameOver();
}

function updateBombCounter() {
  const elBombsCounter = document.querySelector(".bombsCounter");
  elBombsCounter.innerText = gLevel.BOMBS - gGame.markedCount;
}

function startTimer() {
  gStartTime = Date.now();

  gTimerInterval = setInterval(() => {
    const delta = Date.now() - gStartTime;
    const formattedTime = formatTime(delta);

    const elTimer = document.querySelector(".timer");
    elTimer.innerText = formattedTime;
  }, TIMER_INTERVAL);
}

function formatTime(ms) {
  var seconds = Math.floor(ms / 1000);

  return `${padTime(seconds)}`;
}

function padTime(val) {
  return String(val).padStart(3, "0");
}

function resetGame() {
  if (gLevel.SIZE === 4) {
    gGame.lives = 1;
    gGame.numOfHints = 1;
    gGame.usedHints = 0;
  } else if (gLevel.SIZE === 8) {
    gGame.lives = 2;
    gGame.numOfHints = 2;
    gGame.usedHints = 0;
  } else {
    gGame.lives = 3;
    gGame.numOfHints = 3;
    gGame.usedHints = 0;
  }

  updateLives();
  updateHints();
  onInit();
}

function onChangeDifficulty(elBtn) {
  var elTxt = elBtn.innerText;

  if (elTxt === "Easy") {
    gLevel.SIZE = 4;
    gLevel.BOMBS = 2;
    gGame.lives = 1;
    gGame.numOfHints = 1;
    gGame.usedHints = 0;
  } else if (elTxt === "Medium") {
    gLevel.SIZE = 8;
    gLevel.BOMBS = 14;
    gGame.lives = 2;
    gGame.numOfHints = 2;
    gGame.usedHints = 0;
  } else {
    gLevel.SIZE = 12;
    gLevel.BOMBS = 32;
    gGame.lives = 3;
    gGame.numOfHints = 3;
    gGame.usedHints = 0;
  }

  updateLives();
  updateHints();
  onInit();
}
