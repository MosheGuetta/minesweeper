'use strict'

function startTimer() {
    gStartTime = Date.now()
  
    gTimerInterval = setInterval(() => {
      const delta = Date.now() - gStartTime
      const formattedTime = formatTime(delta)
  
      const elTimer = document.querySelector(".timer")
      elTimer.innerText = formattedTime
    }, TIMER_INTERVAL)
  }
  
  function formatTime(ms) {
    var seconds = Math.floor(ms / 1000)
  
    return `${padTime(seconds)}`
  }
  
  function padTime(val) {
    return String(val).padStart(3, "0")
  }