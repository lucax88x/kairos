using System;
using System.IO;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Queries
{
    public class GetTimeEntriesReport : Query<ReportModel>
    {
        public DateTimeOffset From { get; }
        public DateTimeOffset To { get; }

        public GetTimeEntriesReport(DateTimeOffset from, DateTimeOffset to)
        {
            From = from;
            To = to;
        }
    }
}