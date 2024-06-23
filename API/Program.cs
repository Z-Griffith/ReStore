using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using API.Middleware;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => 
{
    var JwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference 
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(JwtSecurityScheme.Reference.Id, JwtSecurityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            JwtSecurityScheme, Array.Empty<string>()
        }
    });

});



builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddIdentityCore<User>(opt => {
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.
                GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>(); // In case of API controller, this scope is valied for the lifetime of this request: HTTP the request comes in API project or service, the request comes in the logic applied and the response goes out
// builder.Services.AddTransient // transient is a very short-lived service that is created and disposed off As it's used inside our classes, it's not kept a lot alive for the length of request
// builder.Services.AddSingleton // no dispose 
var app = builder.Build();

// Middleware: the odrder is always important inside here


// Configure the HTTP request pipeline.
// app.UseDeveloperExceptionPage();
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

// Configure Cross-Origin Resource Sharing (CORS) middleware 
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://170.64.205.145:3000");
});

// app.UseHttpsRedirection();





// app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// other middleware configurations
// app.UseEndpoints(endpoints =>
//         {
//             endpoints.MapControllers(); // or MapRazorPages() if using Razor Pages
//         });


app.MapControllers();

// Creating Dependency Injection Scope - creates a new scope within which services can be resolved
var scope = app.Services.CreateScope();
// Within the scope, GetRequiredService<StoreContext>() retrieves an instance of StoreContext from the service provider. StoreContext represents a database context used to interact with the underlying database.
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();

var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
// Retrieves an instance of ILogger<Program> from the service provider. This logger can be used for logging messages from the Program class.
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

// This method ensures that the latest migrations (database schema changes) are applied to the database. If there are pending migrations, they will be executed.
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occurred during migration");
}


app.Run();

