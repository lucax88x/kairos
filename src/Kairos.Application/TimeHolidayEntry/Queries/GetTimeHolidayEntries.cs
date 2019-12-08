using System;
using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Application.TimeHolidayEntry.Queries
{
    public class GetTimeHolidayEntries : Query<ImmutableList<TimeHolidayEntryReadDto>>
    {
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }

        public GetTimeHolidayEntries(DateTimeOffset start, DateTimeOffset end)
        {
            Start = start;
            End = end;
        }
    }
}