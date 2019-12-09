using System;
using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntries : Query<ImmutableList<TimeEntryAggregationReadDto>>
    {
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }

        public GetTimeEntries(DateTimeOffset start, DateTimeOffset end)
        {
            Start = start;
            End = end;
        }
    }
}