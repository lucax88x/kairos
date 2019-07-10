using GraphQL.Types;

namespace Kairos.Web.Api.GraphQL.Types
{
    public class TimeEntryTypeEnum : EnumerationGraphType
    {
        public TimeEntryTypeEnum()
        {
            Name = nameof(Domain.TimeEntryType);
            Description = "Types of TimeEntry";
            AddValue("IN", "You are entering", (int)Domain.TimeEntryType.In);
            AddValue("OUT", "You are exiting", (int)Domain.TimeEntryType.Out);
        }
    }
}