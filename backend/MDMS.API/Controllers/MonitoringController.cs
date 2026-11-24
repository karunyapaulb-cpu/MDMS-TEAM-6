using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api")]
public class MonitoringController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet("alerts")]
    public async Task<IActionResult> GetAlerts(
        int? zoneId, string? severity, string? status)
    {
        var query = db.Alerts.AsQueryable();

        if (zoneId.HasValue)
            query = query.Where(x => x.ZoneId == zoneId);

        if (!string.IsNullOrEmpty(severity))
            query = query.Where(x => x.Severity == severity);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status == status);

        return Ok(await query
            .OrderByDescending(x => x.Timestamp)
            .ToListAsync());
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications(
        int userId, bool unreadOnly = false)
    {
        var query = db.Notifications
            .Where(x => x.UserId == userId);

        if (unreadOnly)
            query = query.Where(x => !x.IsRead);

        return Ok(await query
            .OrderByDescending(x => x.Timestamp)
            .ToListAsync());
    }

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs(
        string? user, string? status, DateTime? date)
    {
        var query = db.AuditLogs.AsQueryable();

        if (!string.IsNullOrEmpty(user))
            query = query.Where(x => x.User.Contains(user));

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status == status);

        if (date.HasValue)
            query = query.Where(
                x => x.Timestamp.Date == date.Value.Date);

        return Ok(await query
            .OrderByDescending(x => x.Timestamp)
            .ToListAsync());
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings(int? zoneId)
    {
        var settings = await db.Settings
            .FirstOrDefaultAsync(x => x.ZoneId == zoneId);

        return settings == null
            ? NotFound()
            : Ok(settings);
    }
}