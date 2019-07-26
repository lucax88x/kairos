using System;
using Kairos.Common;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Application.TimeAbsenceEntry.Queries
{
    public class GetTimeAbsenceEntryById : Query<TimeAbsenceEntryReadDto>
    {
        public GetTimeAbsenceEntryById(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }
    }
}