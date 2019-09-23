using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntries : Query<ImmutableList<TimeEntryAggregationReadDto>>
    {
        public GetTimeEntries(string user, int year)
        {
            User = user;
            Year = year;
        }

        public string User { get; }
        public int Year { get; }
    }
}