using System;
using Kairos.Common;

namespace Kairos.Domain.Events.TimeEntry
{
    public class TimeEntryDeleted : Event
    {
        public TimeEntryDeleted(Guid id, string? user)
        {
            Id = id;
            User = user;
        }

        public Guid Id { get; }
        public string? User { get; }
    }
}