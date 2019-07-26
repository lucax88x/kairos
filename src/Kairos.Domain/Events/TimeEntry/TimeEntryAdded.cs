using System;
using Kairos.Common;

namespace Kairos.Domain.Events.TimeEntry
{
    public class TimeEntryAdded : Event
    {
        public Guid Id { get; }
        public string User { get; }
        public DateTimeOffset When { get; }
        public TimeEntryType Type { get; }

        public TimeEntryAdded(Guid id, string user, DateTimeOffset when, TimeEntryType type)
        {
            Id = id;
            User = user;
            When = when;
            Type = type;
        }
    }
}