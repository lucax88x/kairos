using Kairos.Common;
using Kairos.Domain.Events.TimeEntry.EventDtos;

namespace Kairos.Domain.Events.TimeEntry
{
    public class TimeEntryUpdated : Event
    {
        public TimeEntryUpdated(TimeEntryEventDto timeEntry)
        {
            TimeEntry = timeEntry;
        }

        public TimeEntryEventDto TimeEntry { get; }
    }
}