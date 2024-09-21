'use strict'

function placeMines()
{
    let mineCount = gLevel.MINES

    while (mineCount > 0)
    {
        const i = getRandomInt(0, Math.sqrt(gBoardSize))
        const j = getRandomInt(0, Math.sqrt(gBoardSize))

        if(!gBoard[i][j].isMine)
        {
            gBoard[i][j].isMine = true
            mineCount --
        }
    }
}


function setMinesNegsCount()
{
    for (var i = 0; i < gBoard.length; i++)
    {
        for (var j = 0; j < gBoard.length; j++)
        {
            let currCell = gBoard[i][j]
            currCell.negMinesCount = countNegMinesArround(i,j)
        }
    }
}


function countNegMinesArround(cellI, cellJ)
{
    let mineCount = 0
    for(var i = cellI - 1; i<cellI + 1; i++)
    {
        for(var j = cellJ - 1; j<= cellJ + 1; j++)
        {
            if(i === cellI && j === cellJ) continue
            if (i < 0 || j < 0 || i >= gBoard.length || j>= gBoard.length) continue
            if (gBoard[i][j].isMine) mineCount ++
        }
    }
    
    return mineCount
}

