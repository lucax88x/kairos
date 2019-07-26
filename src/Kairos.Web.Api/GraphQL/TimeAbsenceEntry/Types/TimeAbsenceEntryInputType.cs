using GraphQL.Types;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types.Inputs;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types
{
    public class TimeAbsenceEntryInputType : InputObjectGraphType<TimeAbsenceEntryInput>
    {
        public TimeAbsenceEntryInputType()
        {
            Name = nameof(TimeAbsenceEntryInput);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.When);
            Field(x => x.Minutes);
            Field(x => x.Type, type: typeof(TimeAbsenceEntryTypeEnum));
        }
    }
}