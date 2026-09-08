using ADHDashboard.Api.Data;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ADHDashboard.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _configuration;

    public AuthController(
        ApplicationDbContext db,
        IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(
        [FromBody] GoogleLoginRequest request)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(
                request.Credential
            );

            var user = _db.Users.FirstOrDefault(
                x => x.GoogleId == payload.Subject
            );

            if (user == null)
            {
                user = new User
                {
                    GoogleId = payload.Subject,
                    Email = payload.Email,
                    Name = payload.Name,
                    PictureUrl = payload.Picture,
                    CreatedAt = DateTime.UtcNow
                };

                _db.Users.Add(user);

                await _db.SaveChangesAsync();
            }

            var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(ClaimTypes.Name, user.Name)
};

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
);

var credentials = new SigningCredentials(
    key,
    SecurityAlgorithms.HmacSha256
);

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddDays(90),
    signingCredentials: credentials
);

var jwt = new JwtSecurityTokenHandler().WriteToken(token);

return Ok(new
{
    message = "Zalogowano",
    token = jwt,
    user = new
    {
        id = user.Id,
        googleId = user.GoogleId,
        email = user.Email,
        name = user.Name,
        picture = user.PictureUrl
    }
});
        }
        catch
        {
            return Unauthorized(new
            {
                message = "Nieprawidłowy token Google"
            });
        }
    }
}

public class GoogleLoginRequest
{
    public string Credential { get; set; } = "";
}