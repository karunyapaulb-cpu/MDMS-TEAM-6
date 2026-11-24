using MDMS.API.Models;

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
        var firstMonth = new DateTime(2025, 12, 1);

        db.Users.Add(new User
        {
            Name = "Enterprise Admin",
            Email = "enterprise@mdms.example",
            Role = "Enterprise"
        });

        for (int z = 0; z < 4; z++)
        {
            var zone = new Zone
            {
                Name = zoneNames[z],
                Location = zoneNames[z],
                Pincode = pincodes[z],
                Admin = $"{zoneNames[z]} Admin",
                Description = "Electricity distribution zone"
            };

            db.Zones.Add(zone);
            db.SaveChanges();

            db.Users.Add(new User
            {
                Name = zone.Admin,
                Email = $"zone{z + 1}@mdms.example",
                Role = "ZoneAdmin",
                ZoneId = zone.Id
            });

            for (int u = 1; u <= 12; u++)
            {
                var user = new User
                {
                    Name = $"{zone.Name} Customer {u}",
                    Email = $"customer{z + 1}_{u}@mdms.example",
                    Phone = $"90000{z + 1}{u:D4}",
                    Role = "Consumer",
                    ZoneId = zone.Id
                };

                db.Users.Add(user);
                db.SaveChanges();

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
                        LastReading = random.Next(2000, 5000)
                    });
                }

                double reading = 1000;

                for (int b = 0; b < 12; b++)
                {
                    var month = firstMonth.AddMonths(b);
                    var dueDate = month.AddMonths(1).AddDays(14);

                    var bill = new Bill
                    {
                        UserId = user.Id,
                        Month = month,
                        DueDate = dueDate,
                        Status = b == 11 ? "Pending"
                            : b == 10 && u % 3 == 0
                                ? "Overdue" : "Paid"
                    };

                    if (bill.Status == "Paid")
                        bill.PaidOn = month.AddMonths(1).AddDays(4);

                    db.Bills.Add(bill);
                    db.SaveChanges();

                    int days = DateTime.DaysInMonth(
                        month.Year, month.Month);

                    decimal total = 0;

                    for (int d = 1; d <= days; d++)
                    {
                        double units = random.Next(50, 180) / 10.0;
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

        var meters = db.Meters.ToList();
        var customers = db.Users
            .Where(x => x.Role == "Consumer").ToList();

        foreach (var meter in meters)
        {
            double value = meter.LastReading - 24;

            for (int hour = 0; hour < 24; hour++)
            {
                double units = random.Next(2, 20) / 10.0;
                value += units;

                db.Readings.Add(new Reading
                {
                    MeterId = meter.Id,
                    Date = today.AddDays(-1).AddHours(hour),
                    Units = units,
                    Value = Math.Round(value, 2),
                    Notes = "Normal"
                });
            }

            meter.LastReading = Math.Round(value, 2);
        }

        for (int i = 0; i < 24; i++)
        {
            var meter = meters[i % meters.Count];

            db.Alerts.Add(new Alert
            {
                MeterId = meter.Id,
                ZoneId = meter.ZoneId,
                Message = i % 2 == 0
                    ? "High consumption"
                    : "Abnormal reading",
                Severity = i % 3 == 0
                    ? "Critical" : "Warning",
                Status = i % 4 == 0
                    ? "Resolved" : "Pending",
                Timestamp = today.AddHours(-i)
            });
        }

        string[] types =
        {
            "Bill generated", "Payment due soon",
            "Payment received", "High consumption",
            "Maintenance"
        };

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

        for (int i = 0; i < 40; i++)
        {
            db.AuditLogs.Add(new AuditLog
            {
                User = "Zone Admin",
                Action = i % 2 == 0 ? "View" : "Update",
                Resource = $"Meter {i + 1}",
                Status = "Success",
                Timestamp = today.AddHours(-i)
            });
        }

        db.Settings.Add(new Setting
        {
            RetentionDays = 365,
            AutoLogoutMinutes = 30,
            AuditRetentionDays = 180,
            EmailEnabled = true
        });

        db.SaveChanges();
        transaction.Commit();
    }
}