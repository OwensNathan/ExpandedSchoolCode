# ExpandedSchoolCode

## Multi-Game Arcade

A collection of interactive browser games implemented in pure JavaScript, featuring:

### Games
- **Tic-Tac-Toe** - Classic 3x3 grid game with AI opponent
- **Connect 4** - 6x7 grid four-in-a-row game with AI
- **Single Pile Nim** - Strategic token removal game with optimal AI
- **Multiple Pile Nim** - Three-pile variant with AI
- **Number Guessing** - Guess a number between 1-100 in 10 attempts
- **Zookkooz** - Placeholder for text adventure
- **Pick A Path** - Placeholder for choose-your-own-adventure

### Features
- **State Persistence** - Save/Load/Reset game statistics using LocalStorage
- **Statistics Tracking** - Tracks Wins, Losses, and Deaths across all games
- **AI Opponents** - Each game features intelligent computer opponents
- **Responsive Design** - Works on desktop and mobile browsers
- **Integration** - Seamlessly connected to RTS Games information pages

### Technology Stack
- Pure JavaScript (ES6+)
- HTML5
- CSS3
- LocalStorage API for persistence

### Running the Application
Simply open `wwwroot/index.html` in a web browser, or serve the `wwwroot` directory with any HTTP server:

```bash
cd wwwroot
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080/index.html`

### Project Structure
- `wwwroot/index.html` - Main entry point
- `wwwroot/app.js` - Complete game implementation and state management
- `wwwroot/site.css` - Game styling
- `wwwroot/HomePage.html` - RTS Games information hub
- `wwwroot/*.html` - Additional RTS game information pages

### Navigation
- From the arcade, click "View RTS Games Info" to explore game information
- From any RTS page, click "Game Arcade" to return to the games

## Legacy Blazor Files
The original Blazor WebAssembly implementation files (`.razor`, `.cs`) are retained for reference but are no longer required to run the application.