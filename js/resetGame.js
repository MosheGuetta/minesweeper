'use strict'

function resetGame() {
    // Reset lives, hints, and safe clicks based on board size
    if (gLevel.SIZE <= 4) {
        gGame.lives = 1;
        gGame.numOfHints = 1;
        gGame.usedHints = 0;
        gGame.safeClicks = 1;  // Easy mode
    } else if (gLevel.SIZE <= 11) {
        gGame.lives = 2;
        gGame.numOfHints = 2;
        gGame.usedHints = 0;
        gGame.safeClicks = 2;  // Medium mode
    } else {
        gGame.lives = 3;
        gGame.numOfHints = 3;
        gGame.usedHints = 0;
        gGame.safeClicks = 3;  // Hard mode
    }

    if (gManualMode) {
        gManualBombsPlaced = 0; // Reset bomb counter for manual mode
        gLevel.BOMBS = 0; // Reset bombs in manual mode
    }

    // Reset general game state
    updateLives();
    updateHints();
    initSafeClick();  // Initialize safe clicks
    onInit();  // Rebuild the board and reset timer, etc.
}

  

