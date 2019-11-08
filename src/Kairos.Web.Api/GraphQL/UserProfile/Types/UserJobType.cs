using GraphQL.Types;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserJobType : ObjectGraphType<UserJobReadDto>
    {
        public UserJobType()
        {
            Name = nameof(UserJobReadDto);
            Description = "It's the single user job";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the user job.");
            Field(d => d.Name).Description("Name of job");
            Field(d => d.Start).Description("Job started on");
            Field(d => d.End, true).Description("Job ended on");
            Field(d => d.HolidaysPerYear).Description("Days of holiday per year");
            Field(d => d.Monday).Description("Monday working hours");
            Field(d => d.Tuesday).Description("Tuesday working hours");
            Field(d => d.Wednesday).Description("Wednesday working hours");
            Field(d => d.Thursday).Description("Thursday working hours");
            Field(d => d.Friday).Description("Friday working hours");
            Field(d => d.Saturday).Description("Saturday working hours");
            Field(d => d.Sunday).Description("Sunday working hours");
        }
    }
}