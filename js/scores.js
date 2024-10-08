"use strict";

let gScores = {
    Easy: JSON.parse(localStorage.getItem('scoreEasy')) || [],
    Medium: JSON.parse(localStorage.getItem('scoreMedium')) || [],
    Hard: JSON.parse(localStorage.getItem('scoreHard')) || [],
    Manual: JSON.parse(localStorage.getItem('scoreManual')) || [],
};


function updateScoreTable() {
    const easyScores = gScores.Easy.sort((a, b) => b.score - a.score).slice(0, 10);
    const mediumScores = gScores.Medium.sort((a, b) => b.score - a.score).slice(0, 10);
    const hardScores = gScores.Hard.sort((a, b) => b.score - a.score).slice(0, 10);
    const manualScores = gScores.Manual.sort((a, b) => b.score - a.score).slice(0, 10);  // For manual mode

    const elScoreTableBody = document.querySelector('.score-table tbody');
    elScoreTableBody.innerHTML = ''; // Clear the table body before updating

    // Loop through and display the top 10 scores for each level
    for (let i = 0; i < Math.max(easyScores.length, mediumScores.length, hardScores.length, manualScores.length); i++) {
        const easyRow = easyScores[i] ? `
            <td>${easyScores[i].name}</td>
            <td>${easyScores[i].score}</td>` 
            : `<td></td>
                <td></td>`;

        const mediumRow = mediumScores[i] ? `
            <td>${mediumScores[i].name}</td>
            <td>${mediumScores[i].score}</td>` 
            : `<td></td>
                <td></td>`;

        const hardRow = hardScores[i] ? `
            <td>${hardScores[i].name}</td>
            <td>${hardScores[i].score}</td>` 
            : `<td></td>
                <td></td>`;

        const manualRow = manualScores[i] ? `
            <td>${manualScores[i].name}</td>
            <td>${manualScores[i].score}</td>` 
            : `<td></td>
                <td></td>`;

        const rowHTML = `<tr>${easyRow}${mediumRow}${hardRow}${manualRow}</tr>`;
        elScoreTableBody.insertAdjacentHTML('beforeend', rowHTML);
    }
}



function saveScore(level, playerName) {
    const newScoreEntry = {
        name: playerName,
        score: gGame.score
    };

    // Save based on level or manual mode
    if (level === 'Easy') {
        gScores.Easy.push(newScoreEntry);
        localStorage.setItem('scoreEasy', JSON.stringify(gScores.Easy));
    } else if (level === 'Medium') {
        gScores.Medium.push(newScoreEntry);
        localStorage.setItem('scoreMedium', JSON.stringify(gScores.Medium));
    } else if (level === 'Hard') {
        gScores.Hard.push(newScoreEntry);
        localStorage.setItem('scoreHard', JSON.stringify(gScores.Hard));
    } else if (level === 'Manual Mode') {
        gScores.Manual.push(newScoreEntry);  
        localStorage.setItem('scoreManual', JSON.stringify(gScores.Manual));
    }

    updateScoreTable(); 
}




