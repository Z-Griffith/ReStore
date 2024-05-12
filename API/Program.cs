using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();


var app = builder.Build();

// Middleware: the odrder is always important inside here

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configure Cross-Origin Resource Sharing (CORS) middleware 
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});

// app.UseHttpsRedirection();

// app.UseRouting();

app.UseAuthorization();

// app.UseEndpoints(endpoints =>
//             {
//                 endpoints.MapControllers(); // Map controllers
//             });

app.MapControllers();

// Creating Dependency Injection Scope - creates a new scope within which services can be resolved
var scope = app.Services.CreateScope();
// Within the scope, GetRequiredService<StoreContext>() retrieves an instance of StoreContext from the service provider. StoreContext represents a database context used to interact with the underlying database.
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
// Retrieves an instance of ILogger<Program> from the service provider. This logger can be used for logging messages from the Program class.
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

// This method ensures that the latest migrations (database schema changes) are applied to the database. If there are pending migrations, they will be executed.
try
{
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}


app.Run();







record WeatherForecast(DateOnly Date, int TemperatureC, string Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
