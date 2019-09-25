using System;
using Kairos.Common;

namespace Kairos.Domain.Events.TimeHolidayEntry
{
    public class TimeHolidayEntryDeleted : Event
    {
        public TimeHolidayEntryDeleted(Guid id, string? user)
        {
            Id = id;
            User = user;
        }

        public Guid Id { get; }
        public string? User { get; }
    }
}