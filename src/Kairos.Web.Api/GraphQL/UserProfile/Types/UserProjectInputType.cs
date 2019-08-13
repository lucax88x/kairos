using GraphQL.Types;
using Kairos.Application.UserProfile.Dtos;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserProjectInputType : InputObjectGraphType<UserProjectModel>
    {
        public UserProjectInputType()
        {
            Name = nameof(UserProjectModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.Name);
            Field(x => x.Start);
            Field(x => x.End, true);
            Field(x => x.Allocation);
        }
    }
}