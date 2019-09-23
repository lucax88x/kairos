using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Application.TimeHolidayEntry.Queries
{
    public class GetTimeHolidayEntries : Query<ImmutableArray<TimeHolidayEntryReadDto>>
    {
        public GetTimeHolidayEntries(string user, int year)
        {
            User = user;
            Year = year;
        }

        public string User { get; }
        public int Year { get; }
    }
}