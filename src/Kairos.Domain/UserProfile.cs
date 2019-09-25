using System.Collections.Immutable;
using System.Linq;
using Kairos.Common;
using Kairos.Domain.Events.UserProfile;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Domain
{
    public class UserProfile : AggregateRoot
    {
        public string? User { get; private set; }
        public ImmutableList<UserJob>? Jobs { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case UserProfileAdded added:
                {
                    Id = added.UserProfile.Id;
                    User = added.UserProfile.User;
                    Jobs = added.UserProfile.Jobs.Select(UserJobEventDto.To).ToImmutableList();
                    return;
                }
                case UserProfileUpdated updated:
                {
                    Jobs = updated.UserProfile.Jobs.Select(UserJobEventDto.To).ToImmutableList();
                    return;
                }
            }
        }

        public static UserProfile Create(UserProfileEventDto userProfile)
        {
            var instance = new UserProfile();

            instance.ApplyChange(new UserProfileAdded(userProfile));

            return instance;
        }

        public void Update(UserProfileEventDto userProfile)
        {
            ApplyChange(new UserProfileUpdated(userProfile));
        }
    }
}