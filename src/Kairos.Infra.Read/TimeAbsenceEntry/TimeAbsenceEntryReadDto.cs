using System;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public class TimeAbsenceEntryReadDto
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Minutes { get; }
        public int Type { get; }

        public TimeAbsenceEntryReadDto(Guid id, DateTimeOffset when, int minutes, int type)
        {
            Id = id;
            When = when;
            Minutes = minutes;
            Type = type;
        }
    }
}