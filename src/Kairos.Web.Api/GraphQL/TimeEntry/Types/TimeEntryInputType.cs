using GraphQL.Types;
using Kairos.Application.TimeEntry.Dtos;

namespace Kairos.Web.Api.GraphQL.TimeEntry.Types
{
    public class TimeEntryInputType : InputObjectGraphType<TimeEntryModel>
    {
        public TimeEntryInputType()
        {
            Name = nameof(TimeEntryModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.When);
            Field(x => x.Type, type: typeof(TimeEntryTypeEnum));
            Field(x => x.Job, type: typeof(IdGraphType));
            Field(x => x.Project, type: typeof(IdGraphType));
        }
    }
}