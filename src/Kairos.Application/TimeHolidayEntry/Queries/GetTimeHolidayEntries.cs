using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Application.TimeHolidayEntry.Queries
{
    public class GetTimeHolidayEntries : Query<ImmutableList<TimeHolidayEntryReadDto>>
    {
        public GetTimeHolidayEntries(int year)
        {
            Year = year;
        }

        public int Year { get; }
    }
}