var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(); // Registers controllers

var app = builder.Build();

app.UseDefaultFiles(); 
app.UseStaticFiles();
app.MapControllers(); 

app.Run();