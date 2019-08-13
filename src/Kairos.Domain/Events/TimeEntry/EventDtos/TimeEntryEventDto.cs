using System;

namespace Kairos.Domain.Events.TimeEntry.EventDtos
{
    public class TimeEntryEventDto
    {
        public TimeEntryEventDto(Guid id, string user, DateTimeOffset when, TimeEntryType type, Guid job, Guid project)
        {
            Id = id;
            User = user;
            When = when;
            Type = type;
            Job = job;
            Project = project;
        }

        public Guid Id { get; }
        public string User { get; }
        public DateTimeOffset When { get; }
        public TimeEntryType Type { get; }
        public Guid Job { get; }
        public Guid Project { get; }
    }
}