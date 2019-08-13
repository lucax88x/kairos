using System;
using Kairos.Common;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Application.TimeHolidayEntry.Queries
{
    public class GetTimeHolidayEntryById : Query<TimeHolidayEntryReadDto>
    {
        public GetTimeHolidayEntryById(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }
    }
}