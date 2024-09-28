"use strict";

let safeClickCount = 0;

function initSafeClick() {
  if (gLevel.SIZE <= 4) {
    gGame.safeClicks = 1;  
  } else if (gLevel.SIZE <= 11) {
    gGame.safeClicks = 2; 
  } else {
    gGame.safeClicks = 3;
  }

  if (gManualMode) {
    gGame.safeClicks = gLevel.SIZE <= 4 ? 1 : (gLevel.SIZE <= 11 ? 2 : 3);  
  }
  
  updateSafeClickButton(); // Update button text to reflect safe click count
}


function onSafeClick() {
  // Check if safe clicks are available for manual mode
  if (gGame.safeClicks <= 0) {
    alert(gManualMode ? "No Safe Clicks left in Manual Mode" : "No Safe Clicks left");
    return;
  }

  // Get a safe cell and highlight it
  let safeCell = getSafeCell();
  if (safeCell) {
    safeCell.classList.add("safe-click");
    gGame.safeClicks--;  

    updateSafeClickButton(); 

    // Remove safe click highlight after 3 seconds
    setTimeout(() => {
      safeCell.classList.remove("safe-click");
    }, 3000);
  }
}


function getSafeCell() {
  let safeCells = [];
  for (let i = 0; i < gBoard.length; i++) {
      for (let j = 0; j < gBoard[i].length; j++) {
          let currCell = gBoard[i][j];
          if (!currCell.isBomb && !currCell.isShown) {
              safeCells.push(document.querySelector(`.cell-${i}-${j}`));
          }
      }
  }

  if (safeCells.length > 0) {
      let randomIndex = Math.floor(Math.random() * safeCells.length);
      return safeCells[randomIndex];
  }
  return null;
}

function updateSafeClickButton() {
  let elSafeClickButton = document.getElementById('safeClickButton');
  if (elSafeClickButton) {
    elSafeClickButton.innerText = `Safe Click (${gGame.safeClicks})`;
  }
}


