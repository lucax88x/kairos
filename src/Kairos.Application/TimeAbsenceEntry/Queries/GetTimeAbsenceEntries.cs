using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Application.TimeAbsenceEntry.Queries
{
    public class GetTimeAbsenceEntries : Query<ImmutableArray<TimeAbsenceEntryReadDto>>
    {
        public GetTimeAbsenceEntries(string user, int year)
        {
            User = user;
            Year = year;
        }

        public string User { get; }
        public int Year { get; }
    }
}