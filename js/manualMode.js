'use strict';

let gManualMode = false;
let gManualBombsPlaced = 0;

function onManualMode() {
    gManualMode = true;
    gManualBombsPlaced = 0;
    document.getElementById('manualModeOptions').style.display = 'block';
    buildBoard(); // Reset the board for manual bomb placement
}

function startManualSetup() {
    gGame.isOn = false; // Stop the game from running
    gManualMode = true; // Enable manual mode

    // Show manual mode options (size input and start button)
    const manualOptions = document.getElementById('manualModeOptions');
    manualOptions.style.display = 'block';

    // Hide the manual mode button
    const manualModeButton = document.querySelector('.btn.manual-mode');
    if (manualModeButton) {
        manualModeButton.style.display = 'none';
    }

    resetGame();
}

function startManualMode() {
    gLevel.NAME = 'Manual Mode';

    let boardSize = parseInt(document.getElementById('boardSize').value);
    if (boardSize < 4 || boardSize > 24) {
        alert("Please enter a size between 4 and 24.");
        return;
    }

    gLevel.SIZE = boardSize;
    gLevel.BOMBS = 0; // Bombs added manually
    gManualBombsPlaced = 0;
    gGame.safeClicks = 1; // One safe click for manual mode

    resetGame(); // Reset game state
    initSafeClick();

    buildBoard(); // Create board of given size
    adjustLivesAndHints(boardSize); // Adjust lives/hints based on size

    document.getElementById('manualModeOptions').style.display = 'none'; // Hide options after start
    document.getElementById('safeClickButton').style.display = 'inline'; // Show safe click button

    gGame.isOn = false;
    const startGameButton = document.getElementById('startGameButton');
    startGameButton.style.display = 'inline-block';
}



function startGame() {
    gManualMode = false; // Disable manual mode
    hideBombs(); // Hide the bombs after manually placing them
    gGame.isOn = true; // Start the game
    document.getElementById('startGameButton').style.display = 'none'; // Hide the start button
    startTimer(); // Start the game timer
    setMinesNegsCount();
}

function hideBombs() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const currCell = gBoard[i][j];
            if (currCell.isBomb) {
                const elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerText = ""; 
            }
        }
    }
}

function adjustLivesAndHints(boardSize) {
    if (boardSize <= 4) {
        gGame.lives = 1;
        gGame.numOfHints = 1;
    } else if (boardSize <= 8) {
        gGame.lives = 2;
        gGame.numOfHints = 2;
    } else {
        gGame.lives = 3;
        gGame.numOfHints = 3;
    }

    updateLives();
    updateHints();
}
