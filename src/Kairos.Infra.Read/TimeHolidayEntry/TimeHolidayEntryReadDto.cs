using System;

namespace Kairos.Infra.Read.TimeHolidayEntry
{
    public class TimeHolidayEntryReadDto
    {
        public Guid Id { get; }
        public string Description { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }

        public TimeHolidayEntryReadDto(Guid id, string description, DateTimeOffset start, DateTimeOffset end)
        {
            Id = id;
            Description = description;
            Start = start;
            End = end;
        }
    }
}