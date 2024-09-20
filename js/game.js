'use strict'

const TIMER_INTERVAL = 31 // how ofen the timer updataes. with prime number 
//                              we can see all of the milseconds
const INITIAL_TIMER_TEXT = '00:00.000' // the way the timer will look like

const EMPTY = ''
const BOMB = '💣'

let gBoardSize = 16
let gLevel = 
{
    SIZE: 4,
    MINES: 2
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

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = INITIAL_TIMER_TEXT

    var gNextNum = 1
    gGame.isOn = true
    buildBoard()
    
}


function buildBoard() 
{
    var boardSize = Math.sqrt(gBoardSize)
    gBoard = []

    for (var i = 0; i < boardSize; i++)
    {
        gBoard[i] = []
        for (var j = 0; j < boardSize; j++)
        {
            let currCell = gBoard[i][j]
            currCell = 
            {
                negMinesCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }

    palceMines()
    setMinesNegsCount()
    renderBoard()
}

function palceMines()
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









    var strHTML = ''

    for (var i = 0; i < boardSize; i++) {
        strHTML += '<tr>' // tr = table row
        
        for (var j = 0; j < boardSize; j++) {
            // td = table data / cell
            strHTML += ` 
                <td class="btn-num"
                    onclick="onCellClicked(this)">
                </td>`
        }
        strHTML += '</tr>'
    }
    document.querySelector('table').innerHTML = strHTML
}


function onCellClicked(elCell, clickedCell) 
{
    if (clickedCell === gNextNum) return

    if (clickedNum === 1) startTimer()
        
    if (clickedNum === gBoardSize) clearInterval(gTimerInterval)

    elCell.classList.add('selected')
    gNextNum++
}


function startTimer() {

    gStartTime = Date.now()

    gTimerInterval = setInterval(() => {

        const delta = Date.now() - gStartTime 
        const formattedTime = formatTime(delta)
        
        const elTimer = document.querySelector('.timer')
        elTimer.innerText = formattedTime
        
    }, TIMER_INTERVAL)
}


function formatTime(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    var milliseconds = ms % 1000

    return `${padTime(minutes)}:${padTime(seconds)}.${padMiliseconds(milliseconds)}`
}


function padTime(val) {
    return String(val).padStart(2, '0')
}


function padMiliseconds(ms) {
    return String(ms).padStart(3, '0')
}


function resetGame() {
    onInit()
}


function onChangeDifficulty(elBtn) 
{
    var elTxt = elBtn.innerText

    if (elTxt === 'Easy'){
        gBoardSize = 16
    } else if (elTxt === 'Medium') {
        gBoardSize = 64
    } else {
        gBoardSize = 144
    }

    onInit()
}

