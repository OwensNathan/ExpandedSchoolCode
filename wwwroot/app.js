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

// ==================== Zookkooz Game (Placeholder) ====================
class ZookkoozGame {
    constructor() {
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h3>Zookkooz</h3>
            <p>This is a placeholder for your text adventure. Extend it as you wish!</p>
            <button id="menuBtn">Back to Menu</button>
        `;
        document.getElementById('menuBtn').addEventListener('click', showMenu);
    }
}

// ==================== Pick A Path Game (Placeholder) ====================
class PickAPathGame {
    constructor() {
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h3>Pick A Path</h3>
            <p>This is a placeholder for your choose-your-own-adventure. Extend it as you wish!</p>
            <button id="menuBtn">Back to Menu</button>
        `;
        document.getElementById('menuBtn').addEventListener('click', showMenu);
    }
}

// ==================== Initialize Application ====================
document.addEventListener('DOMContentLoaded', function() {
    showMenu();
});
