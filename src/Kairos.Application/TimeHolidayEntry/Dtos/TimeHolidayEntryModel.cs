using System;

namespace Kairos.Application.TimeHolidayEntry.Dtos
{
    public class TimeHolidayEntryModel
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public DateTimeOffset Start { get; set; }
        public DateTimeOffset End { get; set; }

        public TimeHolidayEntryModel()
        {
        }

        public TimeHolidayEntryModel(string description, DateTimeOffset start, DateTimeOffset end, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            Description = description;
            Start = start;
            End = end;
        }
    }
}