using System;
using Kairos.Common;

namespace Kairos.Domain.Events.TimeAbsenceEntry
{
    public class TimeAbsenceEntryDeleted : Event
    {
        public TimeAbsenceEntryDeleted(Guid id, string? user)
        {
            Id = id;
            User = user;
        }

        public Guid Id { get; }
        public string? User { get; }
    }
}