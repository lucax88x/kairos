using GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Inputs;

namespace Kairos.Web.Api.GraphQL.Types
{
    public class TimeEntryInputType : InputObjectGraphType<TimeEntryInput>
    {
        public TimeEntryInputType()
        {
            Name = nameof(TimeEntryInput);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.When);
            Field(x => x.Type, type: typeof(TimeEntryTypeEnum));
        }
    }
}