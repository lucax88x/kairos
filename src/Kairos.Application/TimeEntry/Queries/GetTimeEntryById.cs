using System;
using Kairos.Common;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntryById : Query<TimeEntryReadDto>
    {
        public GetTimeEntryById(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }
    }
}