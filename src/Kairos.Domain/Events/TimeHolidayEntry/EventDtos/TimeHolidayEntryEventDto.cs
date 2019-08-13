using System;

namespace Kairos.Domain.Events.TimeHolidayEntry.EventDtos
{
    public class TimeHolidayEntryEventDto
    {
        public Guid Id { get; }
        public string User { get; }
        public string Description { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }

        public TimeHolidayEntryEventDto(Guid id, string user, string description, DateTimeOffset start,
            DateTimeOffset end)
        {
            Id = id;
            User = user;
            Description = description;
            Start = start;
            End = end;
        }
    }
}