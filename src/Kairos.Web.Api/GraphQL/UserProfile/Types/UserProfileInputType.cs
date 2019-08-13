using GraphQL.Types;
using Kairos.Application.UserProfile.Dtos;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserProfileInputType : InputObjectGraphType<UserProfileModel>
    {
        public UserProfileInputType()
        {
            Name = nameof(UserProfileModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.Jobs, type: typeof(ListGraphType<UserJobInputType>));
        }
    }
}