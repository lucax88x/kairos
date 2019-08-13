using System;
using Kairos.Application.TimeHolidayEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class CreateTimeHolidayEntry : Command<Guid>
    {
        public CreateTimeHolidayEntry(TimeHolidayEntryModel timeHolidayEntry)
        {
            TimeHolidayEntry = timeHolidayEntry;
        }

        public TimeHolidayEntryModel TimeHolidayEntry { get; }
    }
}