using Kairos.Common;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;

namespace Kairos.Domain.Events.TimeAbsenceEntry
{
    public class TimeAbsenceEntryAdded : Event
    {
        public TimeAbsenceEntryAdded(TimeAbsenceEntryEventDto timeAbsenceEntry)
        {
            TimeAbsenceEntry = timeAbsenceEntry;
        }

        public TimeAbsenceEntryEventDto TimeAbsenceEntry { get; }
    }
}