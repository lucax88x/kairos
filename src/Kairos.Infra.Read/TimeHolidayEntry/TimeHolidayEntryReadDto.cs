using System;

namespace Kairos.Infra.Read.TimeHolidayEntry
{
    public class TimeHolidayEntryReadDto
    {
        public Guid Id { get; }
        public string Description { get; }
        public DateTimeOffset When { get; }

        public TimeHolidayEntryReadDto(Guid id, string description, DateTimeOffset when)
        {
            Id = id;
            Description = description;
            When = when;
        }
    }
}