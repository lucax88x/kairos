using GraphQL.Types;
using Kairos.Infra.Read.TimeEntry;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserProfileType : ObjectGraphType<UserProfileReadDto>
    {
        public UserProfileType()
        {
            Name = nameof(UserProfileReadDto);
            Description = "It's the user profile";

            Field(d => d.Id, type: typeof(IdGraphType)).Description("The id of the user profile.");
            Field(d => d.Jobs, type: typeof(ListGraphType<UserJobType>)).Description("List of jobs of user");
        }
    }
}