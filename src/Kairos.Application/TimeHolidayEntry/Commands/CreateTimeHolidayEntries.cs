using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeHolidayEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class CreateTimeHolidayEntries : Command<ImmutableList<Guid>>
    {
        public CreateTimeHolidayEntries(params TimeHolidayEntryModel[] timeHolidayEntries)
        {
            TimeHolidayEntries = timeHolidayEntries;
        }

        public IEnumerable<TimeHolidayEntryModel> TimeHolidayEntries { get; }
    }
}