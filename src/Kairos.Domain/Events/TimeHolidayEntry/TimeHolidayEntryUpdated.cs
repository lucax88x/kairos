using Kairos.Common;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;

namespace Kairos.Domain.Events.TimeHolidayEntry
{
    public class TimeHolidayEntryUpdated : Event
    {
        public TimeHolidayEntryUpdated(TimeHolidayEntryEventDto timeHolidayEntry)
        {
            TimeHolidayEntry = timeHolidayEntry;
        }

        public TimeHolidayEntryEventDto TimeHolidayEntry { get; }
    }
}