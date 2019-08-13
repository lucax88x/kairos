using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.UserProfile.Queries;
using Kairos.Domain.Events.UserProfile;
using Kairos.Infra.Read.UserProfile;
using MediatR;

namespace Kairos.Application.UserProfile
{
    public class UserProfileProjection :
        INotificationHandler<UserProfileAdded>,
        INotificationHandler<UserProfileUpdated>,
        IRequestHandler<GetUserProfileByUser, UserProfileReadDto>
    {
        private readonly IUserProfileReadRepository _userProfileReadRepository;
        private readonly IAuthProvider _authProvider;

        public UserProfileProjection(IUserProfileReadRepository userProfileReadRepository, IAuthProvider authProvider)
        {
            _userProfileReadRepository = userProfileReadRepository;
            _authProvider = authProvider;
        }

        public async Task Handle(UserProfileAdded notification, CancellationToken cancellationToken)
        {
            await _userProfileReadRepository.AddOrUpdate(notification.UserProfile);
        }
        
        public async Task Handle(UserProfileUpdated notification, CancellationToken cancellationToken)
        {
            await _userProfileReadRepository.AddOrUpdate(notification.UserProfile);
        }
        
        public async Task<UserProfileReadDto> Handle(GetUserProfileByUser request, CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();
            
            var dto = await _userProfileReadRepository.GetByUser(user);

            return dto;
        }
    }
}