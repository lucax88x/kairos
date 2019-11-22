using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Application.TimeAbsenceEntry.Queries
{
    public class GetTimeAbsenceEntries : Query<ImmutableList<TimeAbsenceEntryReadDto>>
    {
        public GetTimeAbsenceEntries(int year)
        {
            Year = year;
        }

        public int Year { get; }
    }
}