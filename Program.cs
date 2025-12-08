using Blazored.LocalStorage;
using CombinationOfSchoolCode.Shared;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.Services.AddBlazoredLocalStorage();
builder.Services.AddScoped<GameEngine>();
await builder.Build().RunAsync();