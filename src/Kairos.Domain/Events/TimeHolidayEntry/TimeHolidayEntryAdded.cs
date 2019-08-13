using Kairos.Common;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;

namespace Kairos.Domain.Events.TimeHolidayEntry
{
    public class TimeHolidayEntryAdded : Event
    {
        public TimeHolidayEntryAdded(TimeHolidayEntryEventDto timeHolidayEntry)
        {
            TimeHolidayEntry = timeHolidayEntry;
        }

        public TimeHolidayEntryEventDto TimeHolidayEntry { get; }
    }
}