using System;

namespace Kairos.Infra.Read.TimeEntry
{
    public class TimeEntryReadDto
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Type { get; }

        public TimeEntryReadDto(Guid id, DateTimeOffset when, int type)
        {
            Id = id;
            When = when;
            Type = type;
        }
    }
}