'use strict'

function onChangeDifficulty(elBtn) {
    var elTxt = elBtn.innerText;
  
    if (elTxt === "Easy") {
        gLevel.SIZE = 4;
        gLevel.BOMBS = 2;
        gGame.lives = 1;
        gGame.numOfHints = 1;
        gGame.usedHints = 0;
    } else if (elTxt === "Medium") {
        gLevel.SIZE = 8;
        gLevel.BOMBS = 14;
        gGame.lives = 2;
        gGame.numOfHints = 2;
        gGame.usedHints = 0;
    } else {
        gLevel.SIZE = 12;
        gLevel.BOMBS = 32;
        gGame.lives = 3;
        gGame.numOfHints = 3;
        gGame.usedHints = 0;
    }
  
    onInit();
  
  }