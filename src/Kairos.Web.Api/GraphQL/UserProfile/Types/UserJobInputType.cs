using GraphQL.Types;
using Kairos.Application.UserProfile.Dtos;

namespace Kairos.Web.Api.GraphQL.UserProfile.Types
{
    public class UserJobInputType : InputObjectGraphType<UserJobModel>
    {
        public UserJobInputType()
        {
            Name = nameof(UserJobModel);
            Field(x => x.Id, type: typeof(IdGraphType));
            Field(x => x.Name);
            Field(x => x.Start);
            Field(x => x.End, true);
            Field(x => x.HolidaysPerYear);
            Field(x => x.Monday);
            Field(x => x.Tuesday);
            Field(x => x.Wednesday);
            Field(x => x.Thursday);
            Field(x => x.Friday);
            Field(x => x.Saturday);
            Field(x => x.Sunday);
            Field(x => x.Projects, type: typeof(ListGraphType<UserProjectInputType>));
        }
    }
}