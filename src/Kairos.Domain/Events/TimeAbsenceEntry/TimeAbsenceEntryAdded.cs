using System;
using Kairos.Common;

namespace Kairos.Domain.Events.TimeAbsenceEntry
{
    public class TimeAbsenceEntryAdded : Event
    {
        public Guid Id { get; }
        public string User { get; }
        public DateTimeOffset When { get; }
        public int Minutes { get; }

        public TimeAbsenceEntryType Type { get; }

        public TimeAbsenceEntryAdded(Guid id, string user, DateTimeOffset when, int minutes, TimeAbsenceEntryType type)
        {
            Id = id;
            User = user;
            When = when;
            Minutes = minutes;
            Type = type;
        }
    }
}