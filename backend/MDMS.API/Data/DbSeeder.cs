using MDMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MDMS.API.Data;

public static class DbSeeder
{
    public static void Seed(MdmsDbContext db)
    {
        if (db.Zones.Any())
            return;

        using var transaction = db.Database.BeginTransaction();

        var random = new Random(42);

        string[] zoneNames =
        {
            "Mangalore", "Udupi",
            "Surathkal", "Mulki"
        };

        string[] pincodes =
        {
            "575001", "576101",
            "575014", "574154"
        };

        var today = new DateTime(2026, 11, 24);
        var firstMonth = new DateTime(2025, 11, 1);

        // Create Enterprise Admin
        db.Users.Add(new User
        {
            Name = "Enterprise Admin",
            Email = "enterprise@mdms.example",
            Role = "Enterprise",
            Status = "Active"
        });

        // Create four zones
        for (int z = 0; z < 4; z++)
        {
            var zone = new Zone
            {
                Name = zoneNames[z],
                Location = zoneNames[z],
                Pincode = pincodes[z],
                Admin = $"{zoneNames[z]} Admin",
                Description = "Electricity distribution zone",
                Status = "Active"
            };

            db.Zones.Add(zone);
            db.SaveChanges();

            // Create Zone Admin
            db.Users.Add(new User
            {
                Name = zone.Admin,
                Email = $"zone{z + 1}@mdms.example",
                Role = "ZoneAdmin",
                ZoneId = zone.Id,
                Status = "Active"
            });

            // Create 12 customers per zone
            for (int u = 1; u <= 12; u++)
            {
                var user = new User
                {
                    Name = $"{zone.Name} Customer {u}",
                    Email = $"customer{z + 1}_{u}@mdms.example",
                    Phone = $"90000{z + 1}{u:D4}",
                    Role = "Consumer",
                    ZoneId = zone.Id,
                    Status = u == 12 ? "Deactivated" : "Active"
                };

                db.Users.Add(user);
                db.SaveChanges();

                // First two customers have two meters each
                int meterCount = u <= 2 ? 2 : 1;

                for (int m = 1; m <= meterCount; m++)
                {
                    db.Meters.Add(new Meter
                    {
                        MeterNumber = $"MTR-{z + 1}-{u:D2}-{m}",
                        UserId = user.Id,
                        ZoneId = zone.Id,
                        Address = $"{u}, Main Road, {zone.Name}",
                        InstalledDate = firstMonth,
                        TariffCategory = "Domestic",
                        LastReading = random.Next(2000, 5000),
                        Status = u == 12
                            ? "Deactivated"
                            : "Active"
                    });
                }

                double reading = 1000;

                // Generate 12 months of bills per customer
                for (int b = 0; b < 12; b++)
                {
                    var month = firstMonth.AddMonths(b);
                    var dueDate = month.AddMonths(1).AddDays(14);

                    var bill = new Bill
                    {
                        UserId = user.Id,
                        Month = month,
                        DueDate = dueDate,

                        Status = b == 11
                            ? (u % 3 == 0 ? "Overdue" : "Pending")
                            : "Paid"
                    };

                    if (bill.Status == "Paid")
                    {
                        bill.PaidOn = month
                            .AddMonths(1)
                            .AddDays(4);
                    }

                    db.Bills.Add(bill);
                    db.SaveChanges();

                    int days = DateTime.DaysInMonth(
                        month.Year, month.Month);

                    decimal total = 0;

                    // Generate daily bill readings
                    for (int d = 1; d <= days; d++)
                    {
                        double units =
                            random.Next(50, 180) / 10.0;

                        reading += units;

                        decimal cost = (decimal)units * 6.5m;
                        total += cost;

                        db.BillDays.Add(new BillDay
                        {
                            BillId = bill.Id,
                            Date = new DateTime(
                                month.Year, month.Month, d),

                            Reading = Math.Round(reading, 2),
                            Consumption = units,
                            Cost = cost
                        });
                    }

                    bill.Amount = total;
                }

                db.SaveChanges();
            }

            // Zone-level settings
            db.Settings.Add(new Setting
            {
                ZoneId = zone.Id,
                HighConsumption = 30,
                LowConsumption = 2,
                AbnormalFrequency = 5,
                InactiveDuration = 24,
                EmailEnabled = true,
                SmsEnabled = true
            });
        }

        db.SaveChanges();

        // Retrieve generated meters
        var meters = db.Meters
            .OrderBy(x => x.Id)
            .ToList();

        // Retrieve generated customers
        var customers = db.Users
            .Where(x => x.Role == "Consumer")
            .OrderBy(x => x.Id)
            .ToList();

        // Retrieve generated zones
        var zones = db.Zones
            .OrderBy(x => x.Id)
            .ToList();

        // Retrieve admins - declared only once
        var admins = db.Users
            .Where(x => x.Role == "ZoneAdmin"
                     || x.Role == "Enterprise")
            .OrderBy(x => x.Id)
            .ToList();

        // Generate daily and hourly meter readings
        foreach (var meter in meters)
        {
            double value = 1000;

            for (int day = 365; day >= 1; day--)
            {
                var date = today.AddDays(-day);

                // Last two days have hourly readings
                int intervals = day <= 2 ? 24 : 1;

                for (int hour = 0; hour < intervals; hour++)
                {
                    double units = intervals == 24
                        ? random.Next(2, 12) / 10.0
                        : random.Next(60, 180) / 10.0;

                    value += units;

                    db.Readings.Add(new Reading
                    {
                        MeterId = meter.Id,
                        Date = date.AddHours(hour),
                        Units = units,
                        Value = Math.Round(value, 2),
                        Notes = "Normal"
                    });
                }
            }

            meter.LastReading = Math.Round(value, 2);
        }

        // STEP 49.2
        // Generate 24 alerts across all four zones
        for (int i = 0; i < 24; i++)
        {
            // Select zones in rotation
            var zone = zones[i % zones.Count];

            // Retrieve only meters belonging to that zone
            var zoneMeters = meters
                .Where(x => x.ZoneId == zone.Id)
                .ToList();

            // Select a random meter from the selected zone
            var meter = zoneMeters[
                random.Next(zoneMeters.Count)];

            db.Alerts.Add(new Alert
            {
                MeterId = meter.Id,
                ZoneId = meter.ZoneId,

                Message = i % 2 == 0
                    ? "High consumption"
                    : "Abnormal reading",

                Severity = i % 3 == 0
                    ? "Critical"
                    : "Warning",

                Status = (i / zones.Count) % 4 == 0
                    ? "Resolved"
                    : "Pending",

                Timestamp = today.AddHours(-i)
            });
        }

        // Notification types
        string[] types =
        {
            "Bill generated",
            "Payment due soon",
            "Payment received",
            "High consumption",
            "Maintenance"
        };

        // Generate 20 notifications for the demo customer
        for (int i = 0; i < 20; i++)
        {
            db.Notifications.Add(new Notification
            {
                UserId = customers[0].Id,
                Type = types[i % types.Length],
                Message = types[i % types.Length],
                IsRead = i % 3 == 0,
                Timestamp = today.AddHours(-i)
            });
        }

        // Generate 40 audit logs
        // Use the admins list already declared above
        for (int i = 0; i < 40; i++)
        {
            var admin = admins[i % admins.Count];

            var meter = meters[i % meters.Count];

            db.AuditLogs.Add(new AuditLog
            {
                User = admin.Name,

                Action = i % 3 == 0
                    ? "View"
                    : i % 3 == 1
                        ? "Update"
                        : "Generate report",

                Resource = meter.MeterNumber,

                Status = i % 7 == 0
                    ? "Failed"
                    : "Success",

                Timestamp = today.AddHours(-i)
            });
        }

        // Enterprise-level settings
        db.Settings.Add(new Setting
        {
            RetentionDays = 365,
            AutoLogoutMinutes = 30,
            AuditRetentionDays = 180,
            EmailEnabled = true,
            SmsEnabled = true,
            TimeZone = "Asia/Kolkata",
            Language = "English",
            Currency = "INR"
        });

        db.SaveChanges();
        transaction.Commit();
    }
}