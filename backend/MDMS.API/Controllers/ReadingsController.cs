using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/readings")]
public class ReadingsController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetReadings(
        int? userId,
        int? zoneId,
        int? meterId,
        DateTime? from,
        DateTime? to,
        int page = 1,
        int pageSize = 10)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query =
            from reading in db.Readings
            join meter in db.Meters
                on reading.MeterId equals meter.Id
            select new
            {
                reading.Id,
                reading.Date,
                reading.Value,
                reading.Units,
                reading.Notes,
                meter.UserId,
                meter.ZoneId,
                meter.MeterNumber,
                MeterId = meter.Id
            };

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId);

        if (zoneId.HasValue)
            query = query.Where(x => x.ZoneId == zoneId);

        if (meterId.HasValue)
            query = query.Where(x => x.MeterId == meterId);

        if (from.HasValue)
            query = query.Where(x => x.Date >= from.Value.Date);

        if (to.HasValue)
            query = query.Where(
                x => x.Date < to.Value.Date.AddDays(1));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.Date)
            .ThenBy(x => x.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { items, total, page, pageSize });
    }
}