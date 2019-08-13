using GraphQL.Types;
using Kairos.Infra.Read.TimeHolidayEntry;

namespace Kairos.Web.Api.GraphQL.TimeHolidayEntry.Types
{
    public class TimeHolidayEntryType : ObjectGraphType<TimeHolidayEntryReadDto>
    {
        public TimeHolidayEntryType()
        {
            Name = nameof(TimeHolidayEntryReadDto);
            Description = "It's the single time holiday entry";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the time holiday entry.");
            Field(d => d.Description).Description("General description of entry");
            Field(d => d.Start).Description("Start");
            Field(d => d.End).Description("End");
        }
    }
}