// Multi-Game Arcade - Pure JavaScript Implementation
// Converted from Blazor WebAssembly C# application

// ==================== Game Engine & State Management ====================
class GameEngine {
    constructor() {
        this.state = {
            wins: 0,
            losses: 0,
            deaths: 0
        };
        this.loadState();
    }

    saveState() {
        localStorage.setItem('GameSave', JSON.stringify(this.state));
    }

    loadState() {
        const saved = localStorage.getItem('GameSave');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    }

    resetState() {
        this.state = { wins: 0, losses: 0, deaths: 0 };
    }

    addWin() {
        this.state.wins++;
    }

    addLoss() {
        this.state.losses++;
    }

    addDeath() {
        this.state.deaths++;
    }
}

// Global game engine instance
const gameEngine = new GameEngine();

// ==================== Main Menu ====================
function showMenu() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Multi-Game Arcade</h2>
        <div>
            <b>Wins:</b> ${gameEngine.state.wins} |
            <b>Losses:</b> ${gameEngine.state.losses} |
            <b>Deaths:</b> ${gameEngine.state.deaths}
        </div>
        <div style="margin-top: 10px;">
            <a href="HomePage.html" style="text-decoration: none;">
                <button style="padding: 10px 20px; cursor: pointer;">View RTS Games Info</button>
            </a>
        </div>
        <hr />
        <div class="menu">
            <button data-game="SinglePileNim">Single Pile Nim</button>
            <button data-game="MultiplePileNim">Multiple Pile Nim</button>
            <button data-game="NumberGuess">Number Guessing</button>
            <button data-game="TicTacToe">Tic-Tac-Toe</button>
            <button data-game="Connect4">Connect 4</button>
            <button data-game="Zookkooz">Zookkooz</button>
            <button data-game="PickAPath">Pick A Path</button>
            <hr />
            <button id="saveBtn" class="minibtn">Save Progress</button>
            <button id="loadBtn" class="minibtn">Load Progress</button>
            <button id="resetBtn" class="minibtn">Reset Stats</button>
            <div id="message" class="msg"></div>
        </div>
    `;
    
    // Attach event listeners
    document.querySelectorAll('[data-game]').forEach(btn => {
        btn.addEventListener('click', () => startGame(btn.dataset.game));
    });
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
    document.getElementById('resetBtn').addEventListener('click', resetStats);
}

function saveGame() {
    gameEngine.saveState();
    showMessage('Saved!');
}

function loadGame() {
    gameEngine.loadState();
    showMenu();
    showMessage('Loaded!');
}

function resetStats() {
    gameEngine.resetState();
    showMenu();
    showMessage('Stats reset!');
}

function showMessage(msg) {
    const msgDiv = document.getElementById('message');
    if (msgDiv) {
        msgDiv.textContent = msg;
        setTimeout(() => { msgDiv.textContent = ''; }, 2000);
    }
}

function startGame(gameName) {
    switch (gameName) {
        case 'TicTacToe': new TicTacToeGame(); break;
        case 'Connect4': new Connect4Game(); break;
        case 'SinglePileNim': new SinglePileNimGame(); break;
        case 'MultiplePileNim': new MultiplePileNimGame(); break;
        case 'NumberGuess': new NumberGuessGame(); break;
        case 'Zookkooz': new ZookkoozGame(); break;
        case 'PickAPath': new PickAPathGame(); break;
    }
}

// ==================== Tic-Tac-Toe Game ====================
class TicTacToeGame {
    constructor() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(' '));
        this.over = false;
        this.msg = '';
        this.render();
    }

    move(r, c) {
        if (this.board[r][c] !== ' ' || this.over) return;
        
        this.board[r][c] = 'X';
        
        if (this.checkWin('X')) {
            this.over = true;
            gameEngine.addWin();
            this.msg = 'You win!';
            this.render();
            return;
        }
        
        if (this.isFull()) {
            this.over = true;
            this.msg = 'Draw!';
            this.render();
            return;
        }
        
        // AI move
        const [r2, c2] = this.aiMove();
        this.board[r2][c2] = 'O';
        
        if (this.checkWin('O')) {
            this.over = true;
            gameEngine.addLoss();
            this.msg = 'AI wins!';
            this.render();
            return;
        }
        
        if (this.isFull()) {
            this.over = true;
            this.msg = 'Draw!';
        }
        
        this.render();
    }

    aiMove() {
        // Simple AI: First empty slot
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === ' ') {
                    return [i, j];
                }
            }
        }
        return [0, 0];
    }

    checkWin(player) {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === player && this.board[i][1] === player && this.board[i][2] === player) return true;
            if (this.board[0][i] === player && this.board[1][i] === player && this.board[2][i] === player) return true;
        }
        // Check diagonals
        if (this.board[0][0] === player && this.board[1][1] === player && this.board[2][2] === player) return true;
        if (this.board[2][0] === player && this.board[1][1] === player && this.board[0][2] === player) return true;
        return false;
    }

    isFull() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === ' ') return false;
            }
        }
        return true;
    }

    reset() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(' '));
        this.over = false;
        this.msg = '';
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.over) {
            app.innerHTML = `
                <h3>Tic-Tac-Toe</h3>
                <b>${this.msg}</b><br />
                <button id="restartBtn">Restart</button>
                <button id="menuBtn">Menu</button>
            `;
            document.getElementById('restartBtn').addEventListener('click', () => this.reset());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        } else {
            let boardHtml = '<div class="ttt-board">';
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    boardHtml += `<button class="cell" data-row="${i}" data-col="${j}">${this.board[i][j]}</button>`;
                }
                boardHtml += '<br />';
            }
            boardHtml += '</div>';
            
            app.innerHTML = `
                <h3>Tic-Tac-Toe</h3>
                ${boardHtml}
                <button id="menuBtn">Back to Menu</button>
            `;
            
            document.querySelectorAll('.cell').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.move(parseInt(btn.dataset.row), parseInt(btn.dataset.col));
                });
            });
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        }
        
        window.currentGame = this;
    }
}

// ==================== Connect 4 Game ====================
class Connect4Game {
    constructor() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(' '));
        this.over = false;
        this.msg = '';
        this.render();
    }

    move(col) {
        if (this.over) return;
        
        if (!this.drop(col, 'X')) {
            this.msg = 'Column full!';
            this.render();
            return;
        }
        
        if (this.checkWin('X')) {
            this.over = true;
            gameEngine.addWin();
            this.msg = 'You win!';
            this.render();
            return;
        }
        
        if (this.isFull()) {
            this.over = true;
            this.msg = 'Draw!';
            this.render();
            return;
        }
        
        // AI move
        const aiCol = this.aiMove();
        this.drop(aiCol, 'O');
        
        if (this.checkWin('O')) {
            this.over = true;
            gameEngine.addLoss();
            this.msg = 'AI wins!';
            this.render();
            return;
        }
        
        if (this.isFull()) {
            this.over = true;
            this.msg = 'Draw!';
        }
        
        this.render();
    }

    drop(col, player) {
        for (let i = 5; i >= 0; i--) {
            if (this.board[i][col] === ' ') {
                this.board[i][col] = player;
                return true;
            }
        }
        return false;
    }

    aiMove() {
        // Simple AI: random valid column
        for (let tries = 0; tries < 50; tries++) {
            const col = Math.floor(Math.random() * 7);
            if (this.board[0][col] === ' ') return col;
        }
        for (let i = 0; i < 7; i++) {
            if (this.board[0][i] === ' ') return i;
        }
        return 0;
    }

    checkWin(player) {
        // Horizontal
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.isLine(player, i, j, 0, 1)) return true;
            }
        }
        // Vertical
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                if (this.isLine(player, i, j, 1, 0)) return true;
            }
        }
        // Diagonal /
        for (let i = 3; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.isLine(player, i, j, -1, 1)) return true;
            }
        }
        // Diagonal \
        for (let i = 3; i < 6; i++) {
            for (let j = 3; j < 7; j++) {
                if (this.isLine(player, i, j, -1, -1)) return true;
            }
        }
        return false;
    }

    isLine(player, r, c, dr, dc) {
        for (let n = 0; n < 4; n++) {
            if (this.board[r + dr * n][c + dc * n] !== player) return false;
        }
        return true;
    }

    isFull() {
        for (let i = 0; i < 7; i++) {
            if (this.board[0][i] === ' ') return false;
        }
        return true;
    }

    reset() {
        this.board = Array(6).fill(null).map(() => Array(7).fill(' '));
        this.over = false;
        this.msg = '';
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.over) {
            app.innerHTML = `
                <h3>Connect 4</h3>
                <b>${this.msg}</b><br />
                <button id="restartBtn">Restart</button>
                <button id="menuBtn">Menu</button>
            `;
            document.getElementById('restartBtn').addEventListener('click', () => this.reset());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        } else {
            let boardHtml = '<div class="c4-board">';
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 7; j++) {
                    const display = this.board[i][j] === ' ' ? '.' : this.board[i][j];
                    boardHtml += `<button data-col="${j}" class="c4-cell">${display}</button>`;
                }
                boardHtml += '<br />';
            }
            boardHtml += '</div>';
            
            app.innerHTML = `
                <h3>Connect 4</h3>
                ${boardHtml}
                <button id="menuBtn">Back to Menu</button>
            `;
            
            document.querySelectorAll('.c4-cell').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.move(parseInt(btn.dataset.col));
                });
            });
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        }
        
        window.currentGame = this;
    }
}

// ==================== Single Pile Nim Game ====================
class SinglePileNimGame {
    constructor() {
        this.pile = Math.floor(Math.random() * 40) + 10; // 10-49
        this.over = false;
        this.msg = '';
        this.render();
    }

    take(n) {
        if (this.over) return;
        
        this.pile -= n;
        
        if (this.pile <= 0) {
            this.msg = 'You took the last token. You lose.';
            this.over = true;
            gameEngine.addLoss();
            this.render();
            return;
        }
        
        // AI uses optimal strategy
        const aiTake = Math.min(3, ((this.pile - 1) % 4) + 1);
        this.msg = `AI takes ${aiTake}.`;
        this.pile -= aiTake;
        
        if (this.pile <= 0) {
            this.msg = 'AI took last token. You win!';
            this.over = true;
            gameEngine.addWin();
            this.render();
            return;
        }
        
        this.msg += ` Tokens left: ${this.pile}`;
        this.render();
    }

    reset() {
        this.pile = Math.floor(Math.random() * 40) + 10;
        this.over = false;
        this.msg = '';
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.over) {
            app.innerHTML = `
                <h3>Single Pile Nim</h3>
                <b>${this.msg}</b><br />
                <button id="restartBtn">Restart</button>
                <button id="menuBtn">Menu</button>
            `;
            document.getElementById('restartBtn').addEventListener('click', () => this.reset());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        } else {
            let buttons = '';
            const maxTake = Math.min(3, this.pile);
            for (let i = 1; i <= maxTake; i++) {
                buttons += `<button data-take="${i}">Take ${i}</button>`;
            }
            
            app.innerHTML = `
                <h3>Single Pile Nim</h3>
                <div>
                    <p>Tokens left: <b>${this.pile}</b></p>
                    <span>${this.msg}</span>
                    <p>${buttons}</p>
                    <button id="menuBtn">Back to Menu</button>
                </div>
            `;
            
            document.querySelectorAll('[data-take]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.take(parseInt(btn.dataset.take));
                });
            });
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        }
        
        window.currentGame = this;
    }
}

// ==================== Multiple Pile Nim Game ====================
class MultiplePileNimGame {
    constructor() {
        this.piles = [
            Math.floor(Math.random() * 10) + 10, // 10-19
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10
        ];
        this.over = false;
        this.msg = '';
        this.render();
    }

    take(pileIndex, n) {
        if (this.over || this.piles[pileIndex] < n) return;
        
        this.piles[pileIndex] -= n;
        
        const sum = this.piles.reduce((a, b) => a + b, 0);
        if (sum <= 0) {
            this.msg = 'You took the last token. You lose.';
            this.over = true;
            gameEngine.addLoss();
            this.render();
            return;
        }
        
        // AI plays from the biggest pile
        const maxPile = Math.max(...this.piles);
        const ai = this.piles.indexOf(maxPile);
        const aiTake = Math.min(5, this.piles[ai]);
        this.msg = `AI takes ${aiTake} from pile ${ai + 1}.`;
        this.piles[ai] -= aiTake;
        
        const sum2 = this.piles.reduce((a, b) => a + b, 0);
        if (sum2 <= 0) {
            this.msg = 'AI took last token. You win!';
            this.over = true;
            gameEngine.addWin();
            this.render();
            return;
        }
        
        this.msg += ` Piles: [${this.piles.join(', ')}]`;
        this.render();
    }

    reset() {
        this.piles = [
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10
        ];
        this.over = false;
        this.msg = '';
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.over) {
            app.innerHTML = `
                <h3>Multiple Pile Nim</h3>
                <b>${this.msg}</b><br />
                <button id="restartBtn">Restart</button>
                <button id="menuBtn">Menu</button>
            `;
            document.getElementById('restartBtn').addEventListener('click', () => this.reset());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        } else {
            let pilesHtml = '';
            for (let i = 0; i < 3; i++) {
                if (this.piles[i] > 0) {
                    pilesHtml += `<div><b>Pile ${i + 1} (${this.piles[i]}):</b> `;
                    const maxTake = Math.min(5, this.piles[i]);
                    for (let t = 1; t <= maxTake; t++) {
                        pilesHtml += `<button data-pile="${i}" data-take="${t}">Take ${t}</button>`;
                    }
                    pilesHtml += '</div>';
                }
            }
            
            app.innerHTML = `
                <h3>Multiple Pile Nim</h3>
                <div>
                    <p>Piles: ${this.piles.join(', ')}</p>
                    <span>${this.msg}</span>
                    <p>${pilesHtml}</p>
                    <button id="menuBtn">Back to Menu</button>
                </div>
            `;
            
            document.querySelectorAll('[data-pile]').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.take(parseInt(btn.dataset.pile), parseInt(btn.dataset.take));
                });
            });
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        }
        
        window.currentGame = this;
    }
}

// ==================== Number Guessing Game ====================
class NumberGuessGame {
    constructor() {
        this.number = Math.floor(Math.random() * 100) + 1; // 1-100
        this.left = 10;
        this.msg = '';
        this.over = false;
        this.render();
    }

    submit() {
        if (this.over) return;
        
        const input = document.getElementById('guessInput');
        const guess = parseInt(input.value);
        
        if (isNaN(guess)) {
            this.msg = 'Invalid value!';
            this.render();
            return;
        }
        
        if (guess === this.number) {
            this.msg = `Correct! Number was ${this.number}.`;
            this.over = true;
            gameEngine.addWin();
            this.render();
            return;
        }
        
        this.msg = guess < this.number ? 'Too low!' : 'Too high!';
        this.left--;
        
        if (this.left === 0) {
            this.over = true;
            this.msg = `You lose! Number was ${this.number}.`;
            gameEngine.addLoss();
        }
        
        input.value = '';
        this.render();
    }

    reset() {
        this.number = Math.floor(Math.random() * 100) + 1;
        this.left = 10;
        this.msg = '';
        this.over = false;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.over) {
            app.innerHTML = `
                <h3>Number Guessing</h3>
                <b>${this.msg}</b><br />
                <button id="restartBtn">Restart</button>
                <button id="menuBtn">Menu</button>
            `;
            document.getElementById('restartBtn').addEventListener('click', () => this.reset());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        } else {
            app.innerHTML = `
                <h3>Number Guessing</h3>
                <div>
                    <input id="guessInput" type="text" placeholder="Guess 1-100" />
                    <button id="guessBtn">Guess</button>
                    <div>${this.msg}</div>
                    Attempts left: ${this.left}
                    <br /><button id="menuBtn">Back to Menu</button>
                </div>
            `;
            
            const input = document.getElementById('guessInput');
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.submit();
            });
            document.getElementById('guessBtn').addEventListener('click', () => this.submit());
            document.getElementById('menuBtn').addEventListener('click', showMenu);
        }
        
        window.currentGame = this;
    }
}

// ==================== Zookkooz Game (Kroz-based Adventure) ====================
class ZookkoozGame {
    constructor() {
        this.gameStarted = false;
        this.gameOver = false;
        this.gameMessage = '';
        this.statusMessage = '';
        this.moveCount = 0;
        
        this.gridWidth = 15;
        this.gridHeight = 10;
        this.grid = [];
        
        this.playerRow = 1;
        this.playerCol = 1;
        this.exitRow = 8;
        this.exitCol = 13;
        
        this.gemsCollected = 0;
        this.totalGems = 0;
        this.enemies = [];
        
        this.keyListener = null;
        this.render();
    }

    startGame() {
        this.gameStarted = true;
        this.gameOver = false;
        this.gameMessage = '';
        this.statusMessage = 'Collect all gems to unlock the exit!';
        this.moveCount = 0;
        this.gemsCollected = 0;
        
        this.initializeGrid();
        this.setupKeyboard();
        this.render();
    }

    initializeGrid() {
        // Clear grid
        this.grid = [];
        for (let r = 0; r < this.gridHeight; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.gridWidth; c++) {
                this.grid[r][c] = ' ';
            }
        }

        // Add borders
        for (let r = 0; r < this.gridHeight; r++) {
            this.grid[r][0] = '#';
            this.grid[r][this.gridWidth - 1] = '#';
        }
        for (let c = 0; c < this.gridWidth; c++) {
            this.grid[0][c] = '#';
            this.grid[this.gridHeight - 1][c] = '#';
        }

        // Add some internal walls
        for (let r = 2; r < 6; r++) {
            this.grid[r][5] = '#';
        }
        for (let c = 7; c < 12; c++) {
            this.grid[4][c] = '#';
        }
        this.grid[7][7] = '#';
        this.grid[7][8] = '#';
        this.grid[6][10] = '#';
        this.grid[5][10] = '#';

        // Place player at start
        this.playerRow = 1;
        this.playerCol = 1;

        // Place exit
        this.exitRow = this.gridHeight - 2;
        this.exitCol = this.gridWidth - 2;
        this.grid[this.exitRow][this.exitCol] = 'E';

        // Place gems
        this.totalGems = 0;
        const gemPositions = [3, 3, 3, 7, 3, 11, 6, 3, 6, 7, 8, 5, 8, 10];
        for (let i = 0; i < gemPositions.length; i += 2) {
            if (this.grid[gemPositions[i]][gemPositions[i + 1]] === ' ') {
                this.grid[gemPositions[i]][gemPositions[i + 1]] = 'G';
                this.totalGems++;
            }
        }

        // Place enemies
        this.enemies = [];
        this.enemies.push([2, 8]);
        this.enemies.push([5, 12]);
        this.enemies.push([7, 4]);
        for (const enemy of this.enemies) {
            if (this.grid[enemy[0]][enemy[1]] === ' ') {
                this.grid[enemy[0]][enemy[1]] = 'M';
            }
        }
    }

    setupKeyboard() {
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
        }
        
        this.keyListener = (e) => {
            if (!this.gameStarted || this.gameOver) return;
            
            const key = e.key.toUpperCase();
            let newRow = this.playerRow;
            let newCol = this.playerCol;
            
            if (key === 'W' || key === 'ARROWUP') {
                newRow--;
                e.preventDefault();
            } else if (key === 'S' || key === 'ARROWDOWN') {
                newRow++;
                e.preventDefault();
            } else if (key === 'A' || key === 'ARROWLEFT') {
                newCol--;
                e.preventDefault();
            } else if (key === 'D' || key === 'ARROWRIGHT') {
                newCol++;
                e.preventDefault();
            } else {
                return;
            }
            
            this.tryMove(newRow, newCol);
        };
        
        document.addEventListener('keydown', this.keyListener);
    }

    tryMove(newRow, newCol) {
        // Check bounds
        if (newRow < 0 || newRow >= this.gridHeight || newCol < 0 || newCol >= this.gridWidth) {
            return;
        }

        const targetCell = this.grid[newRow][newCol];

        // Check wall
        if (targetCell === '#') {
            this.statusMessage = "Can't walk through walls!";
            this.render();
            return;
        }

        // Check enemy
        if (targetCell === 'M') {
            this.gameOver = true;
            this.gameMessage = '💀 You were caught by an enemy! Game Over!';
            gameEngine.addDeath();
            this.cleanupKeyboard();
            this.render();
            return;
        }

        // Check gem
        if (targetCell === 'G') {
            this.gemsCollected++;
            this.statusMessage = `Collected a gem! (${this.gemsCollected}/${this.totalGems})`;
            if (this.gemsCollected === this.totalGems) {
                this.statusMessage = 'All gems collected! The exit is now open!';
            }
        }

        // Check exit
        if (targetCell === 'E') {
            if (this.gemsCollected >= this.totalGems) {
                this.gameOver = true;
                this.gameMessage = `🎉 Congratulations! You escaped in ${this.moveCount + 1} moves!`;
                gameEngine.addWin();
                this.cleanupKeyboard();
                this.render();
                return;
            } else {
                this.statusMessage = `The exit is locked! Collect all gems first. (${this.gemsCollected}/${this.totalGems})`;
                this.render();
                return;
            }
        }

        // Move player
        this.grid[this.playerRow][this.playerCol] = ' ';
        this.playerRow = newRow;
        this.playerCol = newCol;
        this.moveCount++;

        // Move enemies after player move
        const continueGame = this.moveEnemies();
        
        this.render();
        
        // If enemy caught player, don't continue
        if (!continueGame) {
            return;
        }
    }

    getCellDisplay(row, col) {
        if (row === this.playerRow && col === this.playerCol) {
            return '🧑';
        }
        
        const cell = this.grid[row][col];
        switch (cell) {
            case '#': return '🧱';
            case 'G': return '💎';
            case 'M': return '👾';
            case 'E': return '🚪';
            default: return '·';
        }
    }

    moveEnemies() {
        // Move each enemy randomly
        const directions = [
            [-1, 0],  // up
            [1, 0],   // down
            [0, -1],  // left
            [0, 1]    // right
        ];
        
        const newEnemyPositions = [];
        
        for (let i = 0; i < this.enemies.length; i++) {
            const [enemyRow, enemyCol] = this.enemies[i];
            
            // Clear current enemy position
            this.grid[enemyRow][enemyCol] = ' ';
            
            // Try to move in a random direction
            const validMoves = [];
            for (const [dr, dc] of directions) {
                const newRow = enemyRow + dr;
                const newCol = enemyCol + dc;
                
                // Check if move is valid
                if (newRow >= 0 && newRow < this.gridHeight && 
                    newCol >= 0 && newCol < this.gridWidth) {
                    const targetCell = this.grid[newRow][newCol];
                    // Can move to empty space only
                    if (targetCell === ' ') {
                        validMoves.push([newRow, newCol]);
                    }
                }
            }
            
            // Choose a random valid move, or stay in place
            let newRow = enemyRow;
            let newCol = enemyCol;
            if (validMoves.length > 0) {
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                newRow = randomMove[0];
                newCol = randomMove[1];
            }
            
            // Check if enemy moved onto player
            if (newRow === this.playerRow && newCol === this.playerCol) {
                this.gameOver = true;
                this.gameMessage = '💀 An enemy caught you! Game Over!';
                gameEngine.addDeath();
                this.cleanupKeyboard();
                return false; // Signal game over
            }
            
            newEnemyPositions.push([newRow, newCol]);
        }
        
        // Update all enemy positions
        this.enemies = newEnemyPositions;
        for (const [row, col] of this.enemies) {
            this.grid[row][col] = 'M';
        }
        
        return true; // Continue game
    }

    cleanupKeyboard() {
        if (this.keyListener) {
            document.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
    }

    render() {
        const app = document.getElementById('app');
        
        if (!this.gameStarted) {
            app.innerHTML = `
                <h3>Zookkooz (Kroz Adventure)</h3>
                <div>
                    <p>Welcome to Zookkooz! Navigate through the dungeon, collect all gems (💎), avoid enemies (👾), and reach the exit (🚪)!</p>
                    <p><strong>Controls:</strong> Use W/A/S/D or Arrow keys to move</p>
                    <p><strong>Legend:</strong></p>
                    <ul>
                        <li>🧑 - You (Player)</li>
                        <li>💎 - Gems (collect them all!)</li>
                        <li>👾 - Enemy (avoid or you die!)</li>
                        <li>🚪 - Exit (reach it to win)</li>
                        <li>🧱 - Walls (can't pass through)</li>
                    </ul>
                    <button id="startBtn">Start Game</button>
                    <button id="menuBtn">Back to Menu</button>
                </div>
            `;
            document.getElementById('startBtn').addEventListener('click', () => this.startGame());
            document.getElementById('menuBtn').addEventListener('click', () => {
                this.cleanupKeyboard();
                showMenu();
            });
        } else if (this.gameOver) {
            app.innerHTML = `
                <h3>Zookkooz (Kroz Adventure)</h3>
                <div>
                    <h4>${this.gameMessage}</h4>
                    <p>Gems Collected: ${this.gemsCollected} / ${this.totalGems}</p>
                    <button id="playAgainBtn">Play Again</button>
                    <button id="menuBtn">Back to Menu</button>
                </div>
            `;
            document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
            document.getElementById('menuBtn').addEventListener('click', () => {
                this.cleanupKeyboard();
                showMenu();
            });
        } else {
            let gridHtml = '';
            for (let row = 0; row < this.gridHeight; row++) {
                for (let col = 0; col < this.gridWidth; col++) {
                    const cellContent = this.getCellDisplay(row, col);
                    gridHtml += `<div class="zookkooz-cell">${cellContent}</div>`;
                }
            }
            
            app.innerHTML = `
                <h3>Zookkooz (Kroz Adventure)</h3>
                <div>
                    <p>Gems: ${this.gemsCollected} / ${this.totalGems} | Moves: ${this.moveCount}</p>
                    <div class="zookkooz-grid" style="
                        display: grid;
                        grid-template-columns: repeat(${this.gridWidth}, 1fr);
                        gap: 2px;
                        width: fit-content;
                        margin: 20px auto;
                        padding: 10px;
                        background-color: #333;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    ">
                        ${gridHtml}
                    </div>
                    <p style="margin-top: 10px;">${this.statusMessage}</p>
                    <button id="menuBtn">Back to Menu</button>
                </div>
            `;
            
            // Add styles for the cells
            const style = document.createElement('style');
            style.textContent = `
                .zookkooz-cell {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #1a1a1a;
                    border: 1px solid #444;
                    font-size: 32px;
                    line-height: 1;
                    font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
                    box-sizing: border-box;
                }
                .zookkooz-cell:hover {
                    background-color: #2a2a2a;
                }
            `;
            if (!document.getElementById('zookkooz-style')) {
                style.id = 'zookkooz-style';
                document.head.appendChild(style);
            }
            
            document.getElementById('menuBtn').addEventListener('click', () => {
                this.cleanupKeyboard();
                showMenu();
            });
        }
        
        window.currentGame = this;
    }
}

// ==================== Pick A Path Game (Choose Your Own Adventure) ====================
class PickAPathGame {
    constructor() {
        this.currentNode = 'start';
        this.render();
    }

    makeChoice(nextNode) {
        this.currentNode = nextNode;

        // Track game outcomes
        if (this.isWinNode(nextNode)) {
            gameEngine.addWin();
        } else if (this.isDeathNode(nextNode)) {
            gameEngine.addDeath();
        } else if (this.isLossNode(nextNode)) {
            gameEngine.addLoss();
        }

        this.render();
    }

    restartGame() {
        this.currentNode = 'start';
        this.render();
    }

    isWinNode(node) {
        return node === 'buy_compass' || node === 'befriend_wolf' || node === 'swim_pond' || node === 'uphill';
    }

    isDeathNode(node) {
        return node === 'rob_merchant' || node === 'fight_wolf' || node === 'drink_water' || node === 'downhill';
    }

    isLossNode(node) {
        return node === 'run_from_wolf' || node === 'walk_around_pond';
    }

    render() {
        const app = document.getElementById('app');
        let content = '<h3>Pick A Path - The Enchanted Forest</h3><div>';

        if (this.currentNode === 'start') {
            content += `
                <h4>🌲 Welcome, Adventurer! 🌲</h4>
                <p>You stand at the edge of an ancient enchanted forest. The trees tower above you, their branches swaying mysteriously in the wind. You've heard tales of a legendary treasure hidden deep within, but also of the dangers that lurk in the shadows.</p>
                <p>Before you are three paths:</p>
                <button class="choice-btn" data-choice="path_left">Take the left path (looks well-traveled)</button>
                <button class="choice-btn" data-choice="path_center">Take the center path (darker and mysterious)</button>
                <button class="choice-btn" data-choice="path_right">Take the right path (sunlight filters through)</button>
            `;
        } else if (this.currentNode === 'path_left') {
            content += `
                <h4>🛤️ The Well-Traveled Path</h4>
                <p>You follow the left path. The ground is worn smooth by countless footsteps. After a short walk, you encounter an old merchant sitting beside a campfire.</p>
                <p>"Greetings, traveler!" he says. "I have a magical compass that always points to treasure. I'll trade it for 50 gold coins, or you can try your luck without it."</p>
                <button class="choice-btn" data-choice="buy_compass">Buy the compass (you have exactly 50 gold)</button>
                <button class="choice-btn" data-choice="decline_merchant">Politely decline and continue</button>
                <button class="choice-btn" data-choice="rob_merchant">Attempt to rob the merchant</button>
            `;
        } else if (this.currentNode === 'path_center') {
            content += `
                <h4>🌑 The Dark Path</h4>
                <p>The center path grows darker as you venture deeper. Strange whispers echo around you. Suddenly, you see glowing eyes in the shadows—a dire wolf blocks your path!</p>
                <p>The wolf growls menacingly. What do you do?</p>
                <button class="choice-btn" data-choice="fight_wolf">Fight the wolf with your sword</button>
                <button class="choice-btn" data-choice="befriend_wolf">Try to befriend the wolf with food</button>
                <button class="choice-btn" data-choice="run_from_wolf">Run away quickly</button>
            `;
        } else if (this.currentNode === 'path_right') {
            content += `
                <h4>☀️ The Sunlit Path</h4>
                <p>The right path is pleasant and warm. Sunlight dances through the leaves. You come across a beautiful clearing with a crystal-clear pond.</p>
                <p>In the center of the pond, you see something shimmering beneath the water. A sign reads: "Only the pure of heart may claim the prize."</p>
                <button class="choice-btn" data-choice="swim_pond">Swim to the center of the pond</button>
                <button class="choice-btn" data-choice="walk_around_pond">Walk around the pond and continue</button>
                <button class="choice-btn" data-choice="drink_water">Drink from the pond first</button>
            `;
        } else if (this.currentNode === 'buy_compass') {
            content += `
                <h4>🧭 The Magical Compass</h4>
                <p>You trade your gold for the compass. It immediately spins and points deeper into the forest. Following it carefully, you navigate through dangerous areas safely.</p>
                <p>The compass leads you to a hidden cave. Inside, you find the legendary treasure chest!</p>
                <p><strong>🏆 Victory! You found the treasure!</strong></p>
                <p>The compass was worth every coin. You return home a wealthy adventurer!</p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'decline_merchant') {
            content += `
                <h4>🗺️ Going Alone</h4>
                <p>You thank the merchant and continue on your own. The path splits again into two trails. One leads uphill, the other downhill.</p>
                <button class="choice-btn" data-choice="uphill">Take the uphill trail</button>
                <button class="choice-btn" data-choice="downhill">Take the downhill trail</button>
            `;
        } else if (this.currentNode === 'rob_merchant') {
            content += `
                <h4>⚔️ Bad Decision</h4>
                <p>You attempt to rob the merchant, but he's actually a powerful wizard in disguise!</p>
                <p>"Foolish mortal!" he thunders, and with a wave of his staff, you're turned into a frog.</p>
                <p><strong>💀 Game Over! You spent the rest of your days as a frog by the merchant's campfire.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'fight_wolf') {
            content += `
                <h4>⚔️ The Battle</h4>
                <p>You draw your sword and face the dire wolf. The battle is fierce! You manage to wound the wolf, but it's stronger than you expected.</p>
                <p>With a final lunge, the wolf overpowers you.</p>
                <p><strong>💀 Game Over! The dire wolf was too powerful.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'befriend_wolf') {
            content += `
                <h4>🐺 A Loyal Companion</h4>
                <p>You slowly offer the wolf some dried meat from your pack. The wolf sniffs cautiously, then accepts your offering.</p>
                <p>The wolf's eyes soften, and it begins to wag its tail. It becomes your loyal companion!</p>
                <p>Together, you explore deeper into the forest. The wolf's keen senses lead you safely past traps and dangers, eventually finding a secret grove where the treasure lies!</p>
                <p><strong>🏆 Victory! With your new companion's help, you found the treasure!</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'run_from_wolf') {
            content += `
                <h4>🏃 Retreat!</h4>
                <p>You turn and run as fast as you can! The wolf chases you, but you manage to escape.</p>
                <p>Unfortunately, in your panic, you get completely lost. You wander for days trying to find your way out.</p>
                <p><strong>😞 Loss: You eventually make it home, exhausted and empty-handed.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'swim_pond') {
            content += `
                <h4>💎 The Crystal Prize</h4>
                <p>You wade into the pond and swim to the center. The water is refreshing and pure. As you reach the shimmering object, you find it's a magical crystal!</p>
                <p>The crystal glows with inner light and grants you the vision to see hidden paths. Using this gift, you easily navigate to the treasure's location!</p>
                <p><strong>🏆 Victory! The pure waters rewarded your brave heart!</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'walk_around_pond') {
            content += `
                <h4>🚶 The Long Way</h4>
                <p>You decide not to disturb the pond and walk around it. The path continues through pleasant forest.</p>
                <p>However, without the crystal's guidance, you eventually reach a dead end. The treasure remains hidden from you.</p>
                <p><strong>😞 Loss: You return home safely but without finding the treasure.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'drink_water') {
            content += `
                <h4>🧪 Poisoned!</h4>
                <p>You kneel and drink from the pond. The water tastes sweet at first, but then you feel dizzy.</p>
                <p>The sign said "pure of heart" - but drinking was a test of greed! The water was enchanted to reveal those who would take without permission.</p>
                <p><strong>💀 Game Over! The enchanted water was not meant for drinking.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'uphill') {
            content += `
                <h4>⛰️ Mountain Peak</h4>
                <p>You climb the steep uphill path. It's exhausting, but at the top, you find a magnificent view. From here, you spot smoke rising from a hidden valley below—a sign of civilization!</p>
                <p>You descend and find a village of forest dwellers. They've been guarding the treasure for generations and, impressed by your perseverance in climbing the mountain, they grant you access to it!</p>
                <p><strong>🏆 Victory! Your determination was rewarded!</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        } else if (this.currentNode === 'downhill') {
            content += `
                <h4>🕳️ Into the Ravine</h4>
                <p>You take the easier downhill path. It leads to a deep ravine with a rickety rope bridge.</p>
                <p>As you step onto the bridge, the ropes snap! You fall into the ravine below.</p>
                <p><strong>💀 Game Over! The old bridge couldn't support your weight.</strong></p>
                <button class="choice-btn" id="restartBtn">Play Again</button>
            `;
        }

        content += '<hr /><button id="menuBtn">Back to Menu</button></div>';
        app.innerHTML = content;

        // Attach event listeners
        document.querySelectorAll('[data-choice]').forEach(btn => {
            btn.addEventListener('click', () => this.makeChoice(btn.dataset.choice));
        });

        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }

        document.getElementById('menuBtn').addEventListener('click', showMenu);
        
        window.currentGame = this;
    }
}

// ==================== Initialize Application ====================
document.addEventListener('DOMContentLoaded', function() {
    showMenu();
});
