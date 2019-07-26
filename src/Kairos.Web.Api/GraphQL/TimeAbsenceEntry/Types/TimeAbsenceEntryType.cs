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
            Field(d => d.When).Description("When it happened");
            Field(d => d.Minutes).Description("Sum of minutes (hours * 60)");
            Field(d => d.Type, type: typeof(TimeAbsenceEntryTypeEnum)).Description("The type of the time absence entry.");
        }
    }
}