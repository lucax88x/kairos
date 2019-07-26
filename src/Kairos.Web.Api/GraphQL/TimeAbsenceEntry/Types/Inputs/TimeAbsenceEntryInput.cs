using System;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types.Inputs
{
    public class TimeAbsenceEntryInput
    {
        public Guid Id { get; set; }
        public DateTimeOffset When { get; set; }
        public int Minutes { get; set; }
        public int Type { get; set; }
    }
}