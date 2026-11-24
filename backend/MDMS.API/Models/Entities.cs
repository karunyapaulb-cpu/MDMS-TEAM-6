namespace MDMS.API.Models;

public class Zone
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Location { get; set; } = "";
    public string Pincode { get; set; } = "";
    public string Description { get; set; } = "";
    public string Admin { get; set; } = "";
    public string Status { get; set; } = "Active";
}

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Role { get; set; } = "";
    public int? ZoneId { get; set; }
    public string Status { get; set; } = "Active";
}

public class Meter
{
    public int Id { get; set; }
    public string MeterNumber { get; set; } = "";
    public int UserId { get; set; }
    public int ZoneId { get; set; }
    public string Address { get; set; } = "";
    public string Status { get; set; } = "Active";
    public DateTime InstalledDate { get; set; }
    public string TariffCategory { get; set; } = "";
    public double LastReading { get; set; }
}

public class Bill
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Month { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "";
    public DateTime? PaidOn { get; set; }
}

public class BillDay
{
    public int Id { get; set; }
    public int BillId { get; set; }
    public DateTime Date { get; set; }
    public double Reading { get; set; }
    public double Consumption { get; set; }
    public decimal Cost { get; set; }
}

public class Reading
{
    public int Id { get; set; }
    public int MeterId { get; set; }
    public DateTime Date { get; set; }
    public double Units { get; set; }
    public double Value { get; set; }
    public string Notes { get; set; } = "";
}

public class Alert
{
    public int Id { get; set; }
    public int ZoneId { get; set; }
    public int MeterId { get; set; }
    public string Message { get; set; } = "";
    public string Severity { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime Timestamp { get; set; }
}

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Type { get; set; } = "";
    public string Message { get; set; } = "";
    public bool IsRead { get; set; }
    public DateTime Timestamp { get; set; }
}

public class AuditLog
{
    public int Id { get; set; }
    public string User { get; set; } = "";
    public string Action { get; set; } = "";
    public string Resource { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime Timestamp { get; set; }
}

public class Setting
{
    public int Id { get; set; }
    public int? ZoneId { get; set; }
    public double HighConsumption { get; set; }
    public double LowConsumption { get; set; }
    public int AbnormalFrequency { get; set; }
    public int InactiveDuration { get; set; }
    public bool EmailEnabled { get; set; }
    public bool SmsEnabled { get; set; }
    public int RetentionDays { get; set; }
    public int AutoLogoutMinutes { get; set; }
    public int AuditRetentionDays { get; set; }
    public string TimeZone { get; set; } = "Asia/Kolkata";
    public string Language { get; set; } = "English";
    public string Currency { get; set; } = "INR";
}