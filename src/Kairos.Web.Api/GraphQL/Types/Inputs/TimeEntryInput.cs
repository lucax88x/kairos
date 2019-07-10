using System;

namespace Kairos.Web.Api.GraphQL.Types.Inputs
{
    public class TimeEntryInput
    {
        public Guid Id { get; set; }
        public DateTimeOffset When { get; set; }
        public int Type { get; set; }
    }
}