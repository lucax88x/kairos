using GraphQL.Types;
using Kairos.Infra.Read.TimeAbsenceEntry;
using Kairos.Web.Api.GraphQL.UserProfile.Types;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types
{
    public class TimeAbsenceEntryType : ObjectGraphType<TimeAbsenceEntryAggregationReadDto>
    {
        public TimeAbsenceEntryType()
        {
            Name = nameof(TimeAbsenceEntryAggregationReadDto);
            Description = "It's the single time absence entry";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the time absence entry.");
            Field(d => d.Description).Description("General description of entry");
            Field(d => d.Start).Description("Start");
            Field(d => d.End).Description("End");
            Field(d => d.Type, type: typeof(TimeAbsenceEntryTypeEnum)).Description("The type of the time absence entry.");
            Field(d => d.Job, type: typeof(UserJobType)).Description("The job connected to");
        }
    }
}