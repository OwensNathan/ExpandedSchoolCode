# Copilot Instructions for ExpandedSchoolCode

## Project Overview
This is a dual-purpose web project combining:
1. **Blazor WebAssembly Application** - A multi-game arcade featuring interactive games (Tic-Tac-Toe, Connect 4, Nim variations, Number Guessing, Zookkooz, Pick A Path)
2. **Static HTML Site** - Information pages about Real-Time Strategy (RTS) games (StarCraft series, Age of Empires series, Northgard)

The two sections are linked together, allowing users to navigate between the game arcade and RTS information pages.

## Technology Stack
- **Framework**: Blazor WebAssembly
- **Runtime**: .NET 8.0
- **Language**: C# with nullable reference types enabled
- **Dependencies**:
  - `Microsoft.AspNetCore.Components.WebAssembly` (8.0.0) - Core Blazor WebAssembly framework
  - `Blazored.LocalStorage` (4.3.0) - Local storage for persisting game statistics
- **Frontend**: HTML5, CSS3 with responsive design

## Build and Test Commands
```bash
# Build the project
dotnet build

# Run the application locally
dotnet run

# Restore dependencies
dotnet restore
```

## Project Architecture

### Blazor Application Structure
- **Entry Point**: `Program.cs` - Configures Blazor WebAssembly host and dependency injection
- **Root Component**: `Index.razor` - Main arcade menu displaying game statistics (Wins, Losses, Deaths)
- **Game Engine**: `GameEngine.cs` - Manages game state persistence using Blazored.LocalStorage
- **AI Components**: 
  - `TicTacToeAI.cs` - AI logic for Tic-Tac-Toe
  - `Connect4AI.cs` - AI logic for Connect 4

### Game Components (Razor)
Each game is implemented as a separate Razor component:
- `TicTacToe.razor` - Classic Tic-Tac-Toe game
- `Connect4.razor` - Connect 4 game with AI opponent
- `SinglePileNim.razor` - Single pile Nim game
- `MultiplePileNim.razor` - Multiple pile Nim variant
- `NumberGuess.razor` - Number guessing game
- `Zookkooz.razor` - Custom game implementation
- `PickAPath.razor` - Choice-based game

### Static HTML Pages
- `HomePage.html` - Central hub for RTS game information
- `StarCraft.html`, `StarCraftOne.html`, `StarCraftTwo.html` - StarCraft series info
- `AgeofEmpires.html`, `AOE1.html`, `AOE2.html` - Age of Empires series info
- `NorthGard.html` - Northgard game info
- `TWS.html` - Additional RTS content

### Navigation
- The Blazor app (`Index.razor`) links to the HTML site via a button
- HTML pages link back to the Blazor app via `index.html`
- HTML pages use a home icon (`Picture1.png`) linking to `HomePage.html`

## Styling Conventions

### CSS Architecture
- **`Common.css`** - Shared styles used across all pages
- **`site.css`** - Additional Blazor-specific styles
- **Responsive Design Pattern**:
  - Mobile-first approach with base styles in `Mobile.css` or `SecondMobile.css`
  - Desktop overrides in `Desktop.css` or `SecondDesktop.css` (applied at 500px breakpoint)
  - Media query: `@media screen and (min-width: 500px)`

### Theme System
Two color themes are available:
- **Blue Theme**: `Mobile.css` + `Desktop.css`
- **Green Theme**: `SecondMobile.css` + `SecondDesktop.css`

HTML pages include both `Common.css` and theme-specific CSS files.

## Coding Conventions

### C# Patterns
- **Nullable Reference Types**: Enabled project-wide (`<Nullable>enable</Nullable>`)
- **Random Number Generation**: Use shared static Random instances to improve performance
  - Pattern: `private static readonly Random _random = new();`
  - Applied in: `Connect4AI.cs`, `SinglePileNim.razor`, `MultiplePileNim.razor`, `NumberGuess.razor`
- **Namespace Convention**: Use `CombinationOfSchoolCode.Shared` for shared services like `GameEngine`
- **Async/Await**: Use async methods for local storage operations

### Component Structure
- Game components accept an `OnExit` callback parameter for returning to the main menu
- Game components interact with `GameEngine` (injected via DI) to update statistics
- Use `StateHasChanged()` when state is modified outside of event handlers

### File Organization
- Place AI logic in separate `.cs` files (e.g., `TicTacToeAI.cs`, `Connect4AI.cs`)
- Keep game components self-contained in their respective `.razor` files
- Shared services go in the `CombinationOfSchoolCode.Shared` namespace

## State Management
- Game statistics (Wins, Losses, Deaths) are tracked globally via `GameEngine`
- State is persisted to browser local storage using Blazored.LocalStorage
- Save key: `"GameSave"`
- State can be saved, loaded, and reset via buttons in the main menu

## HTML Page Conventions
- Include proper DOCTYPE and language attribute: `<!DOCTYPE html>` and `<html lang="en">`
- Link CSS in order: `Common.css`, then theme-specific mobile/desktop files
- Include home icon navigation in the header/nav section
- Use semantic HTML5 elements (`<header>`, `<nav>`, etc.)

## Key Dependencies

### Blazored.LocalStorage
Purpose: Persists game statistics across browser sessions
Usage: Injected into `GameEngine` for save/load operations

### Microsoft.AspNetCore.Components.WebAssembly
Purpose: Core framework for building and running Blazor WebAssembly applications
Includes: Component model, routing, dependency injection, and JavaScript interop
