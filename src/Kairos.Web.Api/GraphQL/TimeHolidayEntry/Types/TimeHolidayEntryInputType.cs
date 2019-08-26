using GraphQL.Types;
using Kairos.Application.TimeHolidayEntry.Dtos;

namespace Kairos.Web.Api.GraphQL.TimeHolidayEntry.Types
{
    public class TimeHolidayEntryInputType : InputObjectGraphType<TimeHolidayEntryModel>
    {
        public TimeHolidayEntryInputType()
        {
            Name = nameof(TimeHolidayEntryModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.Description);
            Field(x => x.When);
        }
    }
}