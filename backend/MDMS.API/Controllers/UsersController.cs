using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsers(
        int? zoneId, string? role, string? search)
    {
        var query = db.Users.AsQueryable();

        if (zoneId.HasValue)
            query = query.Where(
                x => x.ZoneId == zoneId);

        if (!string.IsNullOrEmpty(role))
            query = query.Where(x => x.Role == role);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(
                x => x.Name.Contains(search)
                  || x.Email.Contains(search));

        return Ok(await query.Select(u => new
        {
            u.Id,
            u.Name,
            u.Email,
            u.Phone,
            u.Role,
            u.ZoneId,
            u.Status,
            MeterCount = db.Meters.Count(
                m => m.UserId == u.Id)
        }).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await db.Users.FindAsync(id);

        return user == null
            ? NotFound()
            : Ok(user);
    }
}