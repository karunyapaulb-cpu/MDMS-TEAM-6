using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/zones")]
public class ZonesController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetZones()
    {
        return Ok(await db.Zones.Select(z => new
        {
            z.Id,
            z.Name,
            z.Location,
            z.Pincode,
            z.Description,
            z.Admin,
            z.Status,
            TotalMeters = db.Meters.Count(
                m => m.ZoneId == z.Id)
        }).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetZone(int id)
    {
        var zone = await db.Zones.FindAsync(id);

        return zone == null
            ? NotFound()
            : Ok(zone);
    }
}