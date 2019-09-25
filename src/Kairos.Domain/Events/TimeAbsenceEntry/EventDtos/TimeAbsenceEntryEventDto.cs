using System;

namespace Kairos.Domain.Events.TimeAbsenceEntry.EventDtos
{
    public class TimeAbsenceEntryEventDto
    {
        public Guid Id { get; }
        public string? User { get; }
        public string? Description { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }
        public TimeAbsenceEntryType Type { get; }

        public TimeAbsenceEntryEventDto(Guid id, string? user, string? description, DateTimeOffset start,
            DateTimeOffset end,
            TimeAbsenceEntryType type)
        {
            Id = id;
            User = user;
            Description = description;
            Start = start;
            End = end;
            Type = type;
        }
    }
}