using GraphQL.Types;
using Kairos.Application.TimeAbsenceEntry.Dtos;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types
{
    public class TimeAbsenceEntryInputType : InputObjectGraphType<TimeAbsenceEntryModel>
    {
        public TimeAbsenceEntryInputType()
        {
            Name = nameof(TimeAbsenceEntryModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.Description);
            Field(x => x.Start);
            Field(x => x.End);
            Field(x => x.Type, type: typeof(TimeAbsenceEntryTypeEnum));
            Field(x => x.Job, type: typeof(IdGraphType));
        }
    }
}