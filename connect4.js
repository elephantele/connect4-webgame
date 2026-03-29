// game settings
const rows = 6;
const columns = 7;

// game state
let board = [];
let currColumns = [];
let currentPlayer = null;
let playerColor = null;
let computerColor = null;
let gameOver = false;

// ui elements
const welcome = document.getElementById("welcome");
const playBtn = document.getElementById("playBtn");
const setup = document.getElementById("setup");
const game = document.getElementById("game");
const boardEl = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");
const winnerEl = document.getElementById("winner");
const restartBtn = document.getElementById("restartBtn");

// play btn for color settings
playBtn.addEventListener("click", () => {
    welcome.classList.add("hidden");
    setup.classList.remove("hidden");
});

// color selection buttons
document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        startGame(btn.dataset.color);
    });
});

// start of the game
function startGame(color) {
    playerColor = color;
    computerColor = (color === "Red") ? "Yellow" : "Red";

    currentPlayer = "Red"; 
    gameOver = false;

    setup.classList.add("hidden");
    game.classList.remove("hidden");

    restartBtn.classList.add("hidden");
    winnerEl.innerText = "";

    initBoard();
    updateTurnDisplay();

    if (currentPlayer === computerColor) {
        setTimeout(computerMove, 500);
    }
}

// intialize board
function initBoard() {
    board = [];
    currColumns = new Array(columns).fill(rows - 1);
    boardEl.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < columns; c++) {
            row.push(" ");

            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.addEventListener("click", playerMove);
            boardEl.appendChild(tile);
        }

        board.push(row);
    }
}

// update turn display
function updateTurnDisplay() {
    turnDisplay.innerText = `${currentPlayer}'s Turn`;
}

//player move
function playerMove() {
    if (gameOver) return;
    if (currentPlayer !== playerColor) return;

    placePiece(this.id);
}

//comp move based on player
function getSmartMove() {
    for(let c = 0; c < columns; c++){
        let r = currColumns[c];
        if(r < 0) continue;
        board[r][c] = computerColor;
        if(checkWinner()){
            board[r][c] = " ";
            return c;
        }
        board[r][c] = " ";
    }

    //block player
    for(let c = 0; c < columns; c++){
        let r = currColumns[c];
        if(r < 0) continue;

        board[r][c] = playerColor;
        if(checkWinner(true)){
            board[r][c] = " ";
            return c;
        }
        board[r][c] = " ";
    }

    //prefer center
    if(currColumns[3] >= 0) return 3;

    //fallback random
    let available = currColumns
    .map((r,c) => (r >=0 ? c: null))
    .filter(c => c !== null);

    return available[Math.floor(Math.random() * available.length)];
}

// comp move
function computerMove() {
    if (gameOver) return;

   if(gameOver) return;

   let c = getSmartMove();
   let r = currColumns[c];

   placePiece(`${r}-${c}`);
}

// place piece
function placePiece(tileId) {
    const [rStr, cStr] = tileId.split("-");
    const c = parseInt(cStr);
    const r = currColumns[c];

    if (r < 0) return;

    board[r][c] = currentPlayer;

    const tile = document.getElementById(`${r}-${c}`);
    tile.classList.add(currentPlayer === "Red" ? "red-piece" : "yellow-piece");

    currColumns[c] = r - 1;

    if (checkWinner()){
        return;
    } 

    currentPlayer = (currentPlayer === "Red") ? "Yellow" : "Red";
    updateTurnDisplay();

    if (currentPlayer === computerColor) {
        setTimeout(computerMove, 500);
    }
}

//highlight function
function highlightTiles(tiles) {
    tiles.forEach(id => {
        document.getElementById(id).classList.add("highlight");
    });
}

// winner check
function checkWinner(sim = false) {
    // Horizontal →
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r][c+1] &&
                board[r][c+1] === board[r][c+2] &&
                board[r][c+2] === board[r][c+3]) {
                
                if(!sim){
                    setWinner(r,c, [
                        `${r}-${c}`,
                        `${r}-${c+1}`,
                        `${r}-${c+2}`,
                        `${r}-${c+3}`
                    ]);
                }
                return true;
            }
        }
    }


    // vertical ↓
    for(let c = 0; c < columns; c++){
        for(let r = 0; r < rows - 3; r++){
            if(board[r][c] !== " " &&
                board[r][c] === board[r+1][c] &&
                board[r+1][c] === board[r+2][c] &&
                board[r+2][c] === board[r+3][c]) {
                    if(!sim){
                        setWinner(r,c, [
                            `${r}-${c}`,
                            `${r+1}-${c}`,
                            `${r+2}-${c}`,
                            `${r+3}-${c}`
                        ]);
                    }
                    return true;
                }
        }
    }

    // diagonal ↘
   for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r+1][c+1] &&
                board[r+1][c+1] === board[r+2][c+2] &&
                board[r+2][c+2] === board[r+3][c+3]) {

                if (!sim) {
                    setWinner(r, c, [
                        `${r}-${c}`,
                        `${r+1}-${c+1}`,
                        `${r+2}-${c+2}`,
                        `${r+3}-${c+3}`
                    ]);
                }
                return true;
            }
        }
    }

    // diagonal ↗
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r-1][c+1] &&
                board[r-1][c+1] === board[r-2][c+2] &&
                board[r-2][c+2] === board[r-3][c+3]) {

                if (!sim) {
                    setWinner(r, c, [
                        `${r}-${c}`,
                        `${r-1}-${c+1}`,
                        `${r-2}-${c+2}`,
                        `${r-3}-${c+3}`
                    ]);
                }
                return true;
            }
        }
    }

    return false;
}

// set winner
function setWinner(r, c, tiles) {
    let winner = board[r][c];
    winnerEl.innerText = `${winner} Wins!`;
    gameOver = true;

    highlightTiles(tiles);
    restartBtn.classList.remove("hidden");
}

// restart game
restartBtn.addEventListener("click", () => {
    startGame(playerColor);
});
