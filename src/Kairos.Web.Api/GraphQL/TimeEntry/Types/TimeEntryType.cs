using GraphQL.Types;
using Kairos.Infra.Read.TimeEntry;
using Kairos.Web.Api.GraphQL.UserProfile.Types;

namespace Kairos.Web.Api.GraphQL.TimeEntry.Types
{
    public class TimeEntryType : ObjectGraphType<TimeEntryAggregationReadDto>
    {
        public TimeEntryType()
        {
            Name = nameof(TimeEntryAggregationReadDto);
            Description = "It's the single time entry";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the time entry.");
            Field(d => d.When).Description("When it happened");
            Field(d => d.Type, type: typeof(TimeEntryTypeEnum)).Description("The type of the time entry.");
            Field(d => d.Job, type: typeof(UserJobType)).Description("The job connected to");
        }
    }
}