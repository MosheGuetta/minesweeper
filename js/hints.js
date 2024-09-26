'use strict'

function activateHint(elHint) {
    if (!gGame.isHintActive && gGame.numOfHints > gGame.usedHints) {
      elHint.innerText = USED_HINT
      elHint.classList.add("used-hint")
      elHint.onclick = null
      gGame.usedHints++
      gGame.isHintActive = true
    }
  }


function updateHints() {
  const elHints = document.querySelector(".hints")
  let hintsHTML = ""

  for (let i = 0; i < gGame.numOfHints; i++) {
    if (i < gGame.usedHints) {
      // Render used hints
      hintsHTML += `<span class="hint used-hint">${USED_HINT}</span> `
    } else {
      // Render unused hints
      hintsHTML += `<span class="hint" onclick="activateHint(this)">${REGULAR_HINT}</span> `
    }
  }

  elHints.innerHTML = hintsHTML
}


function showCellForSecond(cellI, cellJ) {
    const cellsToShow = []
  
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard.length) continue; // out of borders
        const currCell = gBoard[i][j]
  
        if (!currCell.isShown) {
          cellsToShow.push({
            cell: currCell,
            elCell: document.querySelector(`.cell-${i}-${j}`),
          })
          currCell.isShown = true
          const elCell = document.querySelector(`.cell-${i}-${j}`)
          elCell.classList.add("shown")
          elCell.innerText = currCell.isBomb 
            ? BOMB
            : currCell.negBombsCount > 0
            ? currCell.negBombsCount
            : ""
        }
      }
    }
  
    setTimeout(() => {
      cellsToShow.forEach(({ cell, elCell }) => {
        cell.isShown = false
        elCell.classList.remove("shown")
        elCell.innerText = ""
      });
  
      gGame.isHintActive = false
    }, 1000)
  }