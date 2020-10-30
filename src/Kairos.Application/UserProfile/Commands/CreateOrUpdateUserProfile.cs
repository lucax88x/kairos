using Kairos.Common;
using UserProfileModel = Kairos.Application.UserProfile.Dtos.UserProfileModel;

namespace Kairos.Application.UserProfile.Commands
{
    public class CreateOrUpdateUserProfile : Command<string>
    {
        public CreateOrUpdateUserProfile(UserProfileModel userProfile)
        {
            UserProfile = userProfile;
        }

        public UserProfileModel UserProfile { get; }
    }
}