using Kairos.Common;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;

namespace Kairos.Domain.Events.TimeAbsenceEntry
{
    public class TimeAbsenceEntryUpdated : Event
    {
        public TimeAbsenceEntryUpdated(TimeAbsenceEntryEventDto timeAbsenceEntry)
        {
            TimeAbsenceEntry = timeAbsenceEntry;
        }

        public TimeAbsenceEntryEventDto TimeAbsenceEntry { get; }
    }
}