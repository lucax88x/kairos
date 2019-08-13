using System.Collections.Immutable;
using Kairos.Common;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Application.TimeHolidayEntry.Queries
{
    public class GetTimeHolidayEntries : Query<ImmutableArray<TimeHolidayEntryReadDto>>
    {
        public GetTimeHolidayEntries(string id)
        {
            Id = id;
        }

        public string Id { get; }
    }
}