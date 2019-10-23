using System;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeAbsenceEntriesReport : Query<ReportModel>
    {
        public DateTimeOffset From { get; }
        public DateTimeOffset To { get; }

        public GetTimeAbsenceEntriesReport(DateTimeOffset from, DateTimeOffset to)
        {
            From = from;
            To = to;
        }
    }
}