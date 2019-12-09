using System;
using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Application.TimeAbsenceEntry.Queries
{
    public class GetTimeAbsenceEntries : Query<ImmutableList<TimeAbsenceEntryReadDto>>
    {
        public DateTimeOffset Start { get; }
        public DateTimeOffset End { get; }

        public GetTimeAbsenceEntries(DateTimeOffset start, DateTimeOffset end)
        {
            Start = start;
            End = end;
        }
    }
}