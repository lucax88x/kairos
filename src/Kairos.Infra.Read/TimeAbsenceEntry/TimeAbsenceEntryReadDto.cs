using System;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public class TimeAbsenceEntryReadDto
    {
        public Guid Id { get; }
        public string Description { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }
        public int Type { get; }

        public TimeAbsenceEntryReadDto(Guid id, string description, DateTimeOffset start, DateTimeOffset end, int type)
        {
            Id = id;
            Description = description;
            Start = start;
            End = end;
            Type = type;
        }
    }
}