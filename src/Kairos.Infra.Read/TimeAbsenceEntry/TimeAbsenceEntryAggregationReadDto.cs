using System;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public class TimeAbsenceEntryAggregationReadDto
    {
        public Guid Id { get; }
        public string? Description { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }
        public int Type { get; }
        public UserJobReadDto Job { get; }

        public TimeAbsenceEntryAggregationReadDto(Guid id, string? description, DateTimeOffset start,
            DateTimeOffset end, int type, UserJobReadDto job)
        {
            Id = id;
            Description = description;
            Start = start;
            End = end;
            Type = type;
            Job = job;
        }
    }
}