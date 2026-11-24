using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MDMS.API.Data;

namespace MDMS.API.Controllers;

[ApiController]
[Route("api/bills")]
public class BillsController(MdmsDbContext db)
    : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetBills(
        int userId,
        string? status,
        int page = 1,
        int pageSize = 10)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Bills
            .Where(x => x.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(x => x.Status == status);

        int total = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.Month)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { items, total, page, pageSize });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBill(int id)
    {
        var bill = await db.Bills.FindAsync(id);

        if (bill == null)
            return NotFound();

        var days = await db.BillDays
            .Where(x => x.BillId == id)
            .OrderBy(x => x.Date)
            .ToListAsync();

        return Ok(new { bill, days });
    }
}