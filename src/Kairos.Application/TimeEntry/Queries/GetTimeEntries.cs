using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntries : Query<ImmutableList<TimeEntryAggregationReadDto>>
    {
        public GetTimeEntries(int year)
        {
            Year = year;
        }

        public int Year { get; }
    }
}