using GraphQL.Types;
using Kairos.Infra.Read.TimeAbsenceEntry;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types
{
    public class TimeAbsenceEntryType : ObjectGraphType<TimeAbsenceEntryReadDto>
    {
        public TimeAbsenceEntryType()
        {
            Name = nameof(TimeAbsenceEntryReadDto);
            Description = "It's the single time absence entry";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the time absence entry.");
            Field(d => d.Description).Description("General description of entry");
            Field(d => d.Start).Description("Start");
            Field(d => d.End).Description("End");
            Field(d => d.Type, type: typeof(TimeAbsenceEntryTypeEnum)).Description("The type of the time absence entry.");
        }
    }
}