'use strict'

function buildBoard() {
    var boardSize = gLevel.SIZE
    gBoard = []
  
    for (var i = 0; i < boardSize; i++) {
      gBoard[i] = []
      for (var j = 0; j < boardSize; j++) {
        let currCell =
          // each cell in the board will have:
          {
            minesAroundCount: 0, // negs that are bombs
            isShown: false, // if the cell was clicked or not
            isBomb: false, // if the cell is a bombs
            isMarked: false, // if the cell has a flag
          };
  
        gBoard[i][j] = currCell
      }
    }
  
    renderBoard()
  }
  
  function renderBoard() {
    var strHTML = "<table>"
  
    for (var i = 0; i < gBoard.length; i++) {
      strHTML += "<tr>"
  
      for (var j = 0; j < gBoard.length; j++) {
        let cellClass = ""
  
        if (gBoard[i][j].isShown) {
          cellClass = "shown" // if the cell was clicked we had the shown class
        }
  
        strHTML += ` 
                  <td 
                      class="cell-${i}-${j} ${cellClass}" 
                      onclick="onCellClicked(this, ${i}, ${j})"
                      oncontextmenu="onCellMarked(event, this, ${i}, ${j})">
                  </td>`
      }
      strHTML += "</tr>"
    }
  
    strHTML += "</table>"
    document.querySelector(".card-game").innerHTML = strHTML
  }