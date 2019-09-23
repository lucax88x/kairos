using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeHolidayEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class UpdateTimeHolidayEntry : Command<Guid>
    {
        public UpdateTimeHolidayEntry(TimeHolidayEntryModel timeHolidayEntry)
        {
            TimeHolidayEntry = timeHolidayEntry;
        }

        public TimeHolidayEntryModel TimeHolidayEntry { get; }
    }
}