using Kairos.Common;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Domain.Events.UserProfile
{
    public class UserProfileUpdated : Event
    {
        public UserProfileUpdated(UserProfileEventDto userProfile)
        {
            UserProfile = userProfile;
        }

        public UserProfileEventDto UserProfile { get; }
    }
}