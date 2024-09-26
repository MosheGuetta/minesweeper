'use strict'

function onCellMarked(event, elCell, i, j) {
    event.preventDefault() // remove the regular right click actionnnnnn
  
    if (!gGame.isOn) return
    const currCell = gBoard[i][j]
  
    if (currCell.isShown) return
  
    currCell.isMarked = !currCell.isMarked
  
    if (currCell.isMarked) {
      elCell.innerText = "🚩"
      gGame.markedCount++
      gLevel.BOMBS--
    } else {
      elCell.innerText = ""
      gGame.markedCount--
      gLevel.BOMBS++
    }
  
    updateBombCounter()
    checkGameOver()
  }
