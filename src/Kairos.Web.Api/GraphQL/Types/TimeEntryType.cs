using GraphQL.Types;
using Kairos.Infra.Read.TimeEntry;

namespace Kairos.Web.Api.GraphQL.Types
{
    public class TimeEntryType : ObjectGraphType<TimeEntryReadDto>
    {
        public TimeEntryType()
        {
            Name = nameof(TimeEntryReadDto);
            Description = "It's the single time entry";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the time entry.");
            Field(d => d.When).Description("When it happened");
            Field(d => d.Type, type: typeof(TimeEntryTypeEnum)).Description("The type of the time entry.");
        }
    }
}