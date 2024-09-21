'use strict'

const TIMER_INTERVAL = 31 // how ofen the timer updataes. with prime number 
//                              we can see all of the milseconds
const INITIAL_TIMER_TEXT = '00:00.000' // the way the timer will look like

const EMPTY = ''
const BOMB = '💣'

let gLevel = 
{
    SIZE: 4,
    BOMBS: 2
}

let gGame = 
{
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    timePassed: 0,
}

let gBoard = []
let gBombsCount
let gTimerInterval // holds the interval
let gStartTime // what time the game strats


function onInit() 
{
    clearInterval(gTimerInterval)
    gStartTime = null

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0

    document.querySelector('.restart').classList.add('hidden')

    buildBoard()
    updateBombCounter()
    
}


function buildBoard() 
{
    var boardSize = gLevel.SIZE
    gBoard = []

    for (var i = 0; i < boardSize; i++)
    {
        gBoard[i] = []
        for (var j = 0; j < boardSize; j++)
        {
            let currCell = 
            {
                negBombsCount: 0,
                isShown: false,
                isBomb: false,
                isMarked: false,
            }

            gBoard[i][j] = currCell
        }
    }

    placeBombs()
    setBombsNegsCount()
    renderBoard()
}


function renderBoard()
{
    var strHTML = '<table>'

    for (var i = 0; i < gBoard.length; i++) 
    {
        strHTML += '<tr>' 
        
        for (var j = 0; j < gBoard.length; j++) 
        {
            let cellClass = ''

            if(gBoard[i][j].isShown)
            {
                cellClass = "shown"
            }

            strHTML += ` 
                <td 
                    class="cell-${i}-${j} ${cellClass}" 
                    onclick="onCellClicked(this, ${i}, ${j})"
                    oncontextmenu="onCellMarked(event, this, ${i}, ${j})">
                </td>`
        }
        strHTML += '</tr>'
    }

    strHTML +='</table>'
    document.querySelector('.card-game').innerHTML = strHTML
}


function onCellClicked(elCell, i, j) 
{
    if(!gGame.isOn) return

    const currCell = gBoard[i][j]

    if(currCell.isShown || currCell.isMarked) return

    if (!gStartTime) startTimer()


    if(currCell.isBomb)
    {
        showBombs()
        return
    }

    currCell.isShown = true
    gGame.shownCount++

    elCell.classList.add('shown')
    elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : ''

    if(currCell.negBombsCount === 0)
    {
        showMoreCells(i,j)
    }

    checkGameOver()
}


function showMoreCells(cellI, cellJ) 
{
    for (var i = cellI - 1; i <= cellI + 1; i++) 
    {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) 
        {
            if (i === cellI && j === cellJ) continue

            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard.length) continue

            const currCell = gBoard[i][j]
            const elCell = document.querySelector(`.cell-${i}-${j}`)

            if (!currCell.isShown && !currCell.isBomb && !currCell.isMarked) 
            {
                currCell.isShown = true
                gGame.shownCount++
                elCell.classList.add('shown')
                elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : ''

                if (currCell.negBombsCount === 0) 
                {
                    showMoreCells(i, j)
                }
            }
        }
    }
}


function showBombs() 
{
    for (var i = 0; i < gBoard.length; i++) 
    {
        for (var j = 0; j < gBoard[i].length; j++) 
        {
            let currCell = gBoard[i][j]
            if (currCell.isBomb) 
            {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')
                elCell.innerText = BOMB
            }
        }
    }

    setTimeout(() => {
        alert('Game over!')
        gGame.isOn = false
        clearInterval(gTimerInterval)
        document.querySelector('.restart').classList.remove('hidden')
    }, 100)
}


function checkGameOver() 
{
    let totalCells = gBoard.length * gBoard[0].length
    let nonBombCells = totalCells - gLevel.BOMBS

    if (gGame.shownCount === nonBombCells) 
    {
        
        revealAllCells()

        setTimeout(() => {
            alert('You won!')
            gGame.isOn = false
            clearInterval(gTimerInterval)
            document.querySelector('.restart').classList.remove('hidden')
        }, 100)
    }
}



function showAllCells() 
{
    for (var i = 0; i < gBoard.length; i++) 
    {
        for (var j = 0; j < gBoard[i].length; j++) 
        {
            const currCell = gBoard[i][j]

            if (!currCell.isBomb && !currCell.isShown) 
            {
                const elCell = document.querySelector(`.cell-${i}-${j}`)
                currCell.isShown = true
                elCell.classList.add('shown')
                elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : ''
            }
        }
    }
}



function onCellMarked(event, elCell, i, j) 
{
    event.preventDefault() // remove the regular right click actionnnnnn

    if (!gGame.isOn) return
    const currCell = gBoard[i][j]

    if(currCell.isShown) return

    currCell.isMarked = !currCell.isMarked

    if(currCell.isMarked)
    {
        elCell.innerText = '🚩'
        gGame.markedCount ++
    }
    else
    {
        elCell.innerText = ''
        gGame.markedCount--
    }

    updateBombCounter()
    checkGameOver()
}


function updateBombCounter ()
{
    const elBombsCounter = document.querySelector('.bombsCounter')
    elBombsCounter.innerText = gLevel.BOMBS - gGame.markedCount
}


function startTimer() 
{

    gStartTime = Date.now()

    gTimerInterval = setInterval(() => {

        const delta = Date.now() - gStartTime 
        const formattedTime = formatTime(delta)
        
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = formattedTime
        
    }, TIMER_INTERVAL)
}


function formatTime(ms) 
{
    var minutes = Math.floor(ms / 60000)
    var seconds = Math.floor((ms % 60000) / 1000)
    var milliseconds = ms % 1000

    return `${padTime(minutes)}:${padTime(seconds)}.${padMiliseconds(milliseconds)}`
}


function padTime(val) 
{
    return String(val).padStart(2, '0')
}


function padMiliseconds(ms) 
{
    return String(ms).padStart(3, '0')
}


function resetGame() 
{
    onInit()
}


function onChangeDifficulty(elBtn) 
{
    var elTxt = elBtn.innerText

    if (elTxt === 'Easy') 
    {
        gLevel.SIZE = 4
        gLevel.BOMBS = 2
    } 
    else if (elTxt === 'Medium') 
    {
        gLevel.SIZE = 8
        gLevel.BOMBS = 14
    } 
    else 
    {
        gLevel.SIZE = 12
        gLevel.BOMBS = 32
    }

    onInit()
}
