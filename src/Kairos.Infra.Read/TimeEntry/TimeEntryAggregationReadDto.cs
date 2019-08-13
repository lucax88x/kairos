using System;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Infra.Read.TimeEntry
{
    public class TimeEntryAggregationReadDto
    {
        public TimeEntryAggregationReadDto(Guid id, DateTimeOffset @when, int type, UserJobReadDto job,
            UserProjectReadDto project)
        {
            Id = id;
            When = when;
            Type = type;
            Job = job;
            Project = project;
        }

        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Type { get; }
        public UserJobReadDto Job { get; }
        public UserProjectReadDto Project { get; }
    }
}