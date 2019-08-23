using GraphQL.Types;

namespace Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types
{
    public class TimeAbsenceEntryTypeEnum : EnumerationGraphType
    {
        public TimeAbsenceEntryTypeEnum()
        {
            Name = nameof(Domain.TimeAbsenceEntryType);
            Description = "Types of TimeAbsenceEntry";
            AddValue("VACATION", "You are in vacation", (int) Domain.TimeAbsenceEntryType.Vacation);
            AddValue("ILLNESS", "You are ill", (int) Domain.TimeAbsenceEntryType.Illness);
            AddValue("PERMIT", "You are in permit", (int) Domain.TimeAbsenceEntryType.Permit);
            AddValue("COMPENSATION", "You are compensating extraordinary working hours",
                (int) Domain.TimeAbsenceEntryType.Compensation);
        }
    }
}