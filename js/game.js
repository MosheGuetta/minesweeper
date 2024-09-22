'use strict'

const TIMER_INTERVAL = 31 // how ofen the timer updataes. with prime number 
//                              we can see all of the milseconds
const INITIAL_TIMER_TEXT = '00:00' // the way the timer will look like

const BOMB = '💣'

let gLevel = 
{
    SIZE: 4,
    BOMBS: 2
}

let gGame = 
{
    isOn: false,
    shownCount: 0, // cell that the player clicked on and were not bombs
    markedCount: 0, // marked with flags
    timePassed: 0,
}

let gBoard = []
let gBombsCount
let gTimerInterval // holds the interval
let gStartTime // what time the game strats


function onInit() 
{
    clearInterval(gTimerInterval)
    gStartTime = null // reset the time

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT

    gGame.isOn = true
    gGame.shownCount = 0 // reset the cells the player clicked on
    gGame.markedCount = 0 // reset the cells the player set flag

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
            let currCell = // each cell in the board will have:
            {
                negBombsCount: 0, // negs that are bombs
                isShown: false, // if the cell was clicked or not
                isBomb: false, // if the cell is a bombs
                isMarked: false, // if the cell has a flag
            }

            gBoard[i][j] = currCell
        }
    }

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
                cellClass = "shown" // if the cell was clicked we had the shown class
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
    if (!gGame.isOn) return // Stop if the game is over

    const currCell = gBoard[i][j]

    // If the cell is already shown or marked, do nothing
    if (currCell.isShown || currCell.isMarked) return

    // First click: Place bombs and start the timer
    if (!gStartTime) 
    {
        startTimer()
        placeBombs(i, j) // Place bombs after the first click, excluding this cell
    }

    // Case 1: If the clicked cell is a bomb, reveal all bombs and end the game
    // TO DO: ADD LIVES
    if (currCell.isBomb) 
    {
        showBombs()
        return
    }

    // Case 2: Reveal the current cell
    currCell.isShown = true
    gGame.shownCount++
    elCell.classList.add('shown')
    elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : ''

    // Case 3: If the cell has no neighboring bombs, recursively reveal neighbors
    if (currCell.negBombsCount === 0) 
    {
        expandShown(i, j) // Recursively reveal neighboring cells
    }

    // Check if the player won the game
    checkGameOver()
}


function expandShown(cellI, cellJ) 
{
    for (var i = cellI - 1; i <= cellI + 1; i++) 
    {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) 
        {
            if (i === cellI && j === cellJ) continue // Skip the original cell

            if (i < 0 || j < 0 || i >= gBoard.length || j >= gBoard[i].length) continue // check borders

            const currCell = gBoard[i][j]
            const elCell = document.querySelector(`.cell-${i}-${j}`)

            // Only reveal unshown, unmarked, non-bomb cells
            if (!currCell.isShown && !currCell.isBomb && !currCell.isMarked) 
            {
                currCell.isShown = true
                gGame.shownCount++
                elCell.classList.add('shown')
                elCell.innerText = currCell.negBombsCount > 0 ? currCell.negBombsCount : ''

                // Recursively expand only if the current cell has no neighboring bombs
                if (currCell.negBombsCount === 0) 
                {
                    expandShown(i, j) // Recursion for empty cells
                }
            }
        }
    }
}


function checkGameOver() 
{
    let totalCells = gBoard.length * gBoard[0].length
    let nonBombCells = totalCells - gLevel.BOMBS

    if (gGame.shownCount === nonBombCells) 
    {
        
        showAllCells()

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

    return `${
        padTime(minutes)}
        :${padTime(seconds)}`
}


function padTime(val) 
{
    return String(val).padStart(2, '0')
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
