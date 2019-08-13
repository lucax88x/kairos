using Kairos.Common;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Domain.Events.UserProfile
{
    public class UserProfileAdded : Event
    {
        public UserProfileAdded(UserProfileEventDto userProfile)
        {
            UserProfile = userProfile;
        }

        public UserProfileEventDto UserProfile { get; }
    }
}