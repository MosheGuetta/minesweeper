'use strict'

function updateLives() {
    const elLives = document.querySelector(".lives")
    let livesHTML = ""
  
    for (var i = 0; i < gGame.lives; i++) {
      livesHTML += "💙"
    }
  
    elLives.innerHTML = livesHTML
  }
