'use strict'

function placeBombs(firstClickI, firstClickJ) 
{
    let bombsCount = gLevel.BOMBS

    while (bombsCount > 0) 
    {
        const i = getRandomInt(0, gLevel.SIZE)
        const j = getRandomInt(0, gLevel.SIZE)

        // check to make sure the first clicked sell is not having a bombs in it
        if (Math.abs(i - firstClickI) <= 1 && Math.abs(j - firstClickJ) <= 1) continue

        if (!gBoard[i][j].isBomb) 
        {
            gBoard[i][j].isBomb = true
            bombsCount--
        }
    }

    setBombsNegsCount()
}


// runs on all the board and update each cell how many bombs arround it 
// using countNegBombsArround
function setBombsNegsCount()
{
    for (var i = 0; i < gBoard.length; i++)
    {
        for (var j = 0; j < gBoard.length; j++)
        {
            let currCell = gBoard[i][j]
            currCell.negBombsCount = countNegBombsArround(i,j)
        }
    }
}

// counting the number of bombs serrounding each cell
function countNegBombsArround(cellI, cellJ) 
{
    let bombCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) 
    {  
        for (var j = cellJ - 1; j <= cellJ + 1; j++) 
        {
            if (i === cellI && j === cellJ) continue // Skip the current cell
            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard.length) continue // Bounds check
            if (gBoard[i][j].isBomb) bombCount++ // Check for bombs
        }
    }
    return bombCount
}


