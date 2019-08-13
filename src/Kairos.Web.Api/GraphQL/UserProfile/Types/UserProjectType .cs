using GraphQL.Types;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserProjectType : ObjectGraphType<UserProjectReadDto>
    {
        public UserProjectType()
        {
            Name = nameof(UserProjectReadDto);
            Description = "It's the single user project";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the user job.");
            Field(d => d.Name).Description("Name of job");
            Field(d => d.Start).Description("Project started on");
            Field(d => d.End, true).Description("Project ended on");
            Field(d => d.Allocation).Description("Allocation on project (percentual)");
        }
    }
}