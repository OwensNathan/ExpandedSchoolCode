using System.Threading.Tasks;
using Blazored.LocalStorage;

namespace CombinationOfSchoolCode.Shared;

public class GameState
{
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Deaths { get; set; }
}

public class GameEngine
{
    private const string SaveKey = "GameSave";
    private readonly ILocalStorageService _localStorage;
    public GameState State { get; private set; } = new();

    public GameEngine(ILocalStorageService localStorage) { _localStorage = localStorage; }

    public async Task SaveAsync() => await _localStorage.SetItemAsync(SaveKey, State);
    public async Task LoadAsync() => State = await _localStorage.GetItemAsync<GameState>(SaveKey) ?? new();
    public void Reset() => State = new GameState();
    public void AddWin() => State.Wins++;
    public void AddLoss() => State.Losses++;
    public void AddDeath() => State.Deaths++;
}