using System;
using Kairos.Common;

namespace Kairos.Domain.Events
{
    public class TimeEntryAdded : Event
    {
        public DateTimeOffset When { get; }
        public TimeEntryType Type { get; }

        public TimeEntryAdded(Guid id, DateTimeOffset when, TimeEntryType type) : base(id)
        {
            When = when;
            Type = type;
        }
    }
}