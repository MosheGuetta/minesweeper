'use strict'

function resetGame() {
    if (gLevel.SIZE <= 4) {
        gGame.lives = 1;
        gGame.numOfHints = 1;
        gGame.usedHints = 0;
        gGame.safeClicks = 1;  
    } else if (gLevel.SIZE <= 11) {
        gGame.lives = 2;
        gGame.numOfHints = 2;
        gGame.usedHints = 0;
        gGame.safeClicks = 2;  
    } else {
        gGame.lives = 3;
        gGame.numOfHints = 3;
        gGame.usedHints = 0;
        gGame.safeClicks = 3;  
    }

    if (gManualMode) {
        gManualBombsPlaced = 0; // Reset bomb counter for manual mode
        gLevel.BOMBS = 0; // Reset bombs in manual mode
    }

    updateLives();
    updateHints();
    initSafeClick();  // Initialize safe clicks
    onInit(); 
}

  

