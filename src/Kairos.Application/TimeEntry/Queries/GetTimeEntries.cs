using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntries : Query<ImmutableArray<TimeEntryReadDto>>
    {
    }
}