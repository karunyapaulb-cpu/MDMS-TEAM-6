using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/analytics")]
public class AnalyticsController(MdmsDbContext db)
    : ControllerBase
{
    private static readonly DateTime DemoDate =
        new(2026, 11, 24);

    [HttpGet("consumption")]
    public async Task<IActionResult> GetConsumption(
        string range = "Week",
        int? userId = null,
        int? zoneId = null,
        int? meterId = null,
        DateTime? endDate = null)
    {
        var end = (endDate ?? DemoDate.AddDays(-1)).Date
            .AddDays(1);

        var query =
            from reading in db.Readings
            join meter in db.Meters
                on reading.MeterId equals meter.Id
            select new
            {
                reading.Date,
                reading.Units,
                meter.UserId,
                meter.ZoneId,
                MeterId = meter.Id
            };

        if (userId.HasValue)
            query = query.Where(x => x.UserId == userId);

        if (zoneId.HasValue)
            query = query.Where(x => x.ZoneId == zoneId);

        if (meterId.HasValue)
            query = query.Where(x => x.MeterId == meterId);

        var buckets = new List<
            (string Label, DateTime Start, DateTime End,
             DateTime PreviousStart, DateTime PreviousEnd)>();

        switch (range)
        {
            case "Day":
                for (int i = 0; i < 24; i++)
                {
                    var start = end.AddDays(-1).AddHours(i);

                    buckets.Add((
                        $"{i:D2}:00",
                        start,
                        start.AddHours(1),
                        start.AddDays(-1),
                        start.AddDays(-1).AddHours(1)
                    ));
                }
                break;

            case "Week":
                for (int i = 0; i < 7; i++)
                {
                    var start = end.AddDays(-7 + i);

                    buckets.Add((
                        start.ToString("ddd"),
                        start,
                        start.AddDays(1),
                        start.AddDays(-7),
                        start.AddDays(-6)
                    ));
                }
                break;

            case "Month":
                var monthStart = new DateTime(
                    end.AddDays(-1).Year,
                    end.AddDays(-1).Month, 1);

                var previousMonth = monthStart.AddMonths(-1);

                for (int i = 0; i < 5; i++)
                {
                    var start = monthStart.AddDays(i * 7);
                    var stop = start.AddDays(7);

                    if (start >= monthStart.AddMonths(1))
                        break;

                    if (stop > monthStart.AddMonths(1))
                        stop = monthStart.AddMonths(1);

                    var prevStart = previousMonth.AddDays(i * 7);
                    var prevEnd = prevStart.AddDays(7);

                    if (prevEnd > monthStart)
                        prevEnd = monthStart;

                    buckets.Add((
                        $"Week {i + 1}",
                        start, stop,
                        prevStart, prevEnd
                    ));
                }
                break;

            case "Year":
                var yearStart = new DateTime(
                    end.AddDays(-1).Year, 1, 1);

                for (int i = 0; i < 12; i++)
                {
                    var start = yearStart.AddMonths(i);

                    buckets.Add((
                        start.ToString("MMM"),
                        start,
                        start.AddMonths(1),
                        start.AddYears(-1),
                        start.AddYears(-1).AddMonths(1)
                    ));
                }
                break;

            default:
                return BadRequest("Invalid time range.");
        }

        var result = new List<object>();

        foreach (var bucket in buckets)
        {
            var current = await query
                .Where(x => x.Date >= bucket.Start
                         && x.Date < bucket.End
                         && x.Date < end)
                .SumAsync(x => x.Units);

            var previous = await query
                .Where(x => x.Date >= bucket.PreviousStart
                         && x.Date < bucket.PreviousEnd)
                .SumAsync(x => x.Units);

            result.Add(new
            {
                label = bucket.Label,
                current = Math.Round(current, 2),
                previous = Math.Round(previous, 2)
            });
        }

        return Ok(result);
    }

    [HttpGet("user-dashboard")]
    public async Task<IActionResult> UserDashboard(int userId)
    {
        var user = await db.Users.FindAsync(userId);

        if (user == null)
            return NotFound();

        var zone = await db.Zones.FindAsync(user.ZoneId);

        var bills = await db.Bills
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.Month)
            .ToListAsync();

        var latestBill = bills.FirstOrDefault();

        var lastPayment = bills
            .Where(x => x.Status == "Paid")
            .OrderByDescending(x => x.PaidOn)
            .FirstOrDefault();

        var meters = await db.Meters
            .Where(x => x.UserId == userId)
            .ToListAsync();

        var meterIds = meters.Select(x => x.Id).ToList();

        var start = new DateTime(
            DemoDate.Year, DemoDate.Month, 1);

        var usage = await db.Readings
            .Where(x => meterIds.Contains(x.MeterId)
                     && x.Date >= start
                     && x.Date < DemoDate)
            .SumAsync(x => x.Units);

        var lastSynced = await db.Readings
            .Where(x => meterIds.Contains(x.MeterId))
            .MaxAsync(x => (DateTime?)x.Date);

        return Ok(new
        {
            name = user.Name,
            zone = zone?.Name,
            meterNumber = meters.FirstOrDefault()?.MeterNumber,
            lastSynced,
            currentConsumption = Math.Round(usage, 2),
            monthlyBill = latestBill?.Amount ?? 0,
            dueDate = latestBill?.DueDate,
            outstandingBalance = bills
                .Where(x => x.Status != "Paid")
                .Sum(x => x.Amount),
            lastPayment = lastPayment?.Amount ?? 0,
            paidOn = lastPayment?.PaidOn
        });
    }

    [HttpGet("zone-dashboard")]
    public async Task<IActionResult> ZoneDashboard(int zoneId)
    {
        var zone = await db.Zones.FindAsync(zoneId);

        if (zone == null)
            return NotFound();

        var meters = db.Meters.Where(x => x.ZoneId == zoneId);

        var activeMeters = await meters
            .CountAsync(x => x.Status == "Active");

        var pendingAlerts = await db.Alerts.CountAsync(
            x => x.ZoneId == zoneId &&
                 x.Status == "Pending");

        var meterIds = await meters
            .Select(x => x.Id).ToListAsync();

        var readings = db.Readings.Where(
            x => meterIds.Contains(x.MeterId));

        var monthStart = new DateTime(
            DemoDate.Year, DemoDate.Month, 1);

        var current = await readings
            .Where(x => x.Date >= monthStart
                     && x.Date < DemoDate)
            .SumAsync(x => x.Units);

        var previous = await readings
            .Where(x => x.Date >= monthStart.AddMonths(-1)
                     && x.Date < monthStart.AddDays(
                         DemoDate.Day - 1).AddMonths(-1))
            .SumAsync(x => x.Units);

        return Ok(new
        {
            zone = zone.Name,
            activeMeters,
            averageUsage = Math.Round(
                current / Math.Max(1, meterIds.Count), 2),
            usageChange = previous == 0 ? 0 :
                Math.Round((current - previous) / previous * 100, 2),
            pendingAlerts
        });
    }

    [HttpGet("enterprise-dashboard")]
    public async Task<IActionResult> EnterpriseDashboard()
    {
        return Ok(new
        {
            totalZones = await db.Zones.CountAsync(),
            totalMeters = await db.Meters.CountAsync(),
            criticalAlerts = await db.Alerts.CountAsync(
                x => x.Severity == "Critical"
                  && x.Status == "Pending"),
            recentAlerts = await db.Alerts
                .Where(x => x.Severity == "Critical")
                .OrderByDescending(x => x.Timestamp)
                .Take(5)
                .ToListAsync()
        });
    }

    [HttpGet("zone-comparison")]
    public async Task<IActionResult> ZoneComparison(
        string period = "Month")
    {
        var start = period switch
        {
            "Week" => DemoDate.AddDays(-7),
            "Year" => DemoDate.AddYears(-1),
            _ => DemoDate.AddMonths(-1)
        };

        var zones = await db.Zones.ToListAsync();
        var result = new List<object>();

        foreach (var zone in zones)
        {
            var meterIds = await db.Meters
                .Where(x => x.ZoneId == zone.Id)
                .Select(x => x.Id)
                .ToListAsync();

            var total = await db.Readings
                .Where(x => meterIds.Contains(x.MeterId)
                         && x.Date >= start
                         && x.Date < DemoDate)
                .SumAsync(x => x.Units);

            result.Add(new
            {
                label = zone.Name,
                current = Math.Round(total, 2),
                previous = Math.Round(
                    total / Math.Max(1, meterIds.Count), 2)
            });
        }

        return Ok(result);
    }
}