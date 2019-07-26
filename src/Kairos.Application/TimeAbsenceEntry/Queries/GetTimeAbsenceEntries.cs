using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Application.TimeAbsenceEntry.Queries
{
    public class GetTimeAbsenceEntries : Query<ImmutableArray<TimeAbsenceEntryReadDto>>
    {
        public GetTimeAbsenceEntries(string id)
        {
            Id = id;
        }

        public string Id { get; }
    }
}