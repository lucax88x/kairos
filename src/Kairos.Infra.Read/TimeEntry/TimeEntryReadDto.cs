using System;

namespace Kairos.Infra.Read.TimeEntry
{
    internal class TimeEntryReadDto
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Type { get; }
        public Guid Job { get; }
        public TimeEntryReadDto(Guid id, DateTimeOffset when, int type, Guid job)
        {
            Id = id;
            When = when;
            Type = type;
            Job = job;
        }
    }
}