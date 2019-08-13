using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using Kairos.Domain.Events.UserProfile.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.UserProfile
{
    public class UserProfileService :
        IRequestHandler<CreateOrUpdateUserProfile, string>
    {
        private readonly IWriteRepository _writeRepository;
        private readonly IAuthProvider _authProvider;
        private readonly IMediator _mediator;

        public UserProfileService(IWriteRepository writeRepository, IMediator mediator, IAuthProvider authProvider)
        {
            _writeRepository = writeRepository;
            _mediator = mediator;
            _authProvider = authProvider;
        }

        public async Task<string> Handle(CreateOrUpdateUserProfile request, CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var userProfile = await _writeRepository.GetOrDefault<Domain.UserProfile>(user);

            var userProfileEventDto = new UserProfileEventDto(request.UserProfile.Id, user,
                request.UserProfile.Jobs.Select(UserJobModel.To));
            
            if (userProfile == null)
            {
                userProfile = Domain.UserProfile.Create(userProfileEventDto);
            }
            else
            {
                userProfile.Update(userProfileEventDto);
            }

            var events = await _writeRepository.Save(profile => profile.User, userProfile);
            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return userProfile.User;
        }
    }
}