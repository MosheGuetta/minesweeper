"use strict"

const TIMER_INTERVAL = 31 // how ofen the timer updataes. with prime number
//                              we can see all of the milseconds
const INITIAL_TIMER_TEXT = "000" // the way the timer will look like

const BOMB = "💣"
const REGULAR_HINT = "🤔"
const USED_HINT = "🤐"

let gLevel = {
  SIZE: 4,
  BOMBS: 2,
  NAME: 'Easy'
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
  score: 0,
}

let gBoard = []
let gBombsCount
let gTimerInterval // holds the interval
let gStartTime; // what time the game strats

function onInit() {
  clearInterval(gTimerInterval);
  gStartTime = null; // reset the time

  var elTimer = document.querySelector(".timer");
  elTimer.innerText = INITIAL_TIMER_TEXT;

  document.querySelector(".restart").innerText = '😃'; 

  gGame.isOn = true;
  gGame.shownCount = 0; // reset the cells the player clicked on
  gGame.markedCount = 0; // reset the cells the player set flag
  gGame.score = 0;


  buildBoard()
  updateBombCounter();
  updateLives();
  updateHints();
  updateScoreTable();
  initSafeClick() 
}


function onCellClicked(elCell, i, j) {
  if (!gGame.isOn && !gManualMode) return;

  const currCell = gBoard[i][j];

  // If the cell is already shown or marked, do nothing
  if (currCell.isShown || currCell.isMarked) return;

  // Manual Mode: Place bombs manually
  if (gManualMode) {
      if (!currCell.isBomb) {
          currCell.isBomb = true;
          elCell.innerText = BOMB;
          gManualBombsPlaced++;
          gLevel.BOMBS++;
          updateBombCounter();
      } else {
          alert("This cell already has a bomb.");
      }
      return;
  }

  // Safe Click logic
  if (gGame.isHintActive) {
      showCellForSecond(i, j);
      gGame.isHintActive = false;
      gGame.score -= 5; // Lose 5 points when using a hint
      updateHints();
      return;
  }

  // First Click Logic
  if (!gStartTime) {
      startTimer();
      placeBombs(i, j); // Place bombs after the first click
  }

  // If clicked on a bomb, lose a life
  if (currCell.isBomb) {
      gGame.lives--;
      gLevel.BOMBS--
      updateLives();
      updateBombCounter();

      currCell.isShown = true;
      elCell.classList.add("shown");
      elCell.innerText = BOMB;

      if (gGame.lives === 0) {
          alert('You touched a bomb. You have no lives left!');
          showBombs();
          checkGameOver(true);
      } else {
          alert(`You touched a bomb. You have ${gGame.lives} lives left.`);
      }
      return;
  }

  // Reveal Cell
  currCell.isShown = true;
  gGame.shownCount++;
  gGame.score += 10;
  elCell.classList.add("shown");
  elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : "";

  // Expand if no bombs around
  if (currCell.negBombsCount === 0) {
      expandShown(i, j);
  }

  checkGameOver();
}


function expandShown(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue // Skip the original cell

      if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[i].length)
        continue; // check borders

      const currCell = gBoard[i][j]
      const elCell = document.querySelector(`.cell-${i}-${j}`)

      // Only reveal unshown, unmarked, non-bomb cells
      if (!currCell.isShown && !currCell.isBomb && !currCell.isMarked) {
        currCell.isShown = true
        gGame.shownCount++
        elCell.classList.add("shown")
        elCell.innerText =
          currCell.negBombsCount > 0 ? currCell.negBombsCount : ""

        // Recursively expand only if the current cell has no neighboring bombs
        if (currCell.negBombsCount === 0) {
          expandShown(i, j) // Recursion for empty cells
        }
      }
    }
  }
}


function checkGameOver(isLost = false) {
  let totalCells = gBoard.length * gBoard[0].length;
  let nonBombCells = totalCells - gLevel.BOMBS;
  let unopenedBombCells = gLevel.BOMBS - gGame.markedCount; // Unopened bomb cells

  // Check if there are no non-bomb cells (i.e., the board is only bombs)
  if (gLevel.BOMBS === totalCells) {
      alert('Game over: Only bombs are on the board!');
      showAllCells(); // Reveal all cells
      gGame.isOn = false; // Stop the game
      clearInterval(gTimerInterval); // Stop the timer
      return;
  }

  // If all non-bomb cells are revealed or if the player lost
  if (gGame.shownCount === nonBombCells || isLost) {
      showAllCells(); // Reveal all cells
      gGame.isOn = false; // Stop the game
      clearInterval(gTimerInterval); // Stop the timer

      // Update score if the player won
      if (!isLost) {
          gGame.score += unopenedBombCells * 20; // Each unopened bomb cell gives 20 points
          if (gGame.lives > 0) gGame.score += gGame.lives * 25; // Extra points for remaining lives
      }

      // Update the restart button emoji based on the outcome
      if (isLost) {
          document.querySelector('.restart').innerText = '😞'; // Set to sad face on loss
      } else {
          document.querySelector('.restart').innerText = '😎'; // Set to cool face on win
      }

      // Determine win/lose message
      let resultMessage = isLost ? `You Lost! ` : `You Won! `;
      let finalMessage = `${resultMessage}Your score: ${gGame.score}\n`;

      // Prompt for player name with result message included
      let playerName = prompt(finalMessage + "Enter your name:", "Anonymous");

      let level = getDifficultyLevel()
      saveScore(level, playerName);


      // Show win/lose message on the screen
      const gameOutcome = document.getElementById('gameOutcome');
      gameOutcome.style.display = 'block';
      gameOutcome.innerHTML = resultMessage + `Your score: ${gGame.score}`;

      // Update the table immediately after the game ends
      updateScoreTable();
  }
}




function showAllCells() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      const currCell = gBoard[i][j]

      if (!currCell.isBomb && !currCell.isShown) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        currCell.isShown = true
        elCell.classList.add("shown")
        elCell.innerText =
          currCell.negBombsCount > 0 ? currCell.negBombsCount : ""
      }
    }
  }
}


function getDifficultyLevel() {
  // Prioritize Manual Mode
  if (gLevel.NAME === 'Manual Mode') return 'Manual Mode';

  // Default to size-based difficulty
  if (gLevel.SIZE <= 4) return 'Easy';
  if (gLevel.SIZE <= 11) return 'Medium';
  return 'Hard';
}




