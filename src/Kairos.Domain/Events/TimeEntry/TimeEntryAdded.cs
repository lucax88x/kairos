using Kairos.Common;
using Kairos.Domain.Events.TimeEntry.EventDtos;

namespace Kairos.Domain.Events.TimeEntry
{
    public class TimeEntryAdded : Event
    {
        public TimeEntryAdded(TimeEntryEventDto timeEntry)
        {
            TimeEntry = timeEntry;
        }

        public TimeEntryEventDto TimeEntry { get; }
    }
}