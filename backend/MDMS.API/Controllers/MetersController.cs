using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/meters")]
public class MetersController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMeters(
        int? zoneId,
        int? userId,
        string? status,
        string? search,
        int page = 1,
        int pageSize = 10)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query =
            from meter in db.Meters
            join user in db.Users
                on meter.UserId equals user.Id
            join zone in db.Zones
                on meter.ZoneId equals zone.Id
            select new
            {
                meter.Id,
                meter.MeterNumber,
                meter.UserId,
                meter.ZoneId,
                Owner = user.Name,
                Zone = zone.Name,
                meter.Status,
                meter.LastReading,
                meter.Address,
                meter.InstalledDate,
                meter.TariffCategory
            };

        if (zoneId.HasValue)
            query = query.Where(x => x.ZoneId == zoneId);

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status == status);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(
                x => x.MeterNumber.Contains(search)
                  || x.Owner.Contains(search));

        int total = await query.CountAsync();

        var items = await query.OrderBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMeter(int id)
    {
        var meter = await db.Meters.FindAsync(id);

        return meter == null
            ? NotFound()
            : Ok(meter);
    }

    [HttpGet("{id:int}/readings")]
    public async Task<IActionResult> GetReadings(int id)
    {
        return Ok(await db.Readings
            .Where(x => x.MeterId == id)
            .OrderBy(x => x.Date)
            .ToListAsync());
    }
}