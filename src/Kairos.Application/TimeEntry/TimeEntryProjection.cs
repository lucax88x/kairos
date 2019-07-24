using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Domain.Events;
using Kairos.Infra.Read.TimeEntry;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryProjection :
        INotificationHandler<TimeEntryAdded>,
        INotificationHandler<TimeEntryDeleted>,
        IRequestHandler<GetTimeEntryById, TimeEntryReadDto>,
        IRequestHandler<GetTimeEntries, ImmutableArray<TimeEntryReadDto>>
    {
        private readonly ITimeEntryReadRepository _timeEntryReadRepository;

        public TimeEntryProjection(ITimeEntryReadRepository timeEntryReadRepository)
        {
            _timeEntryReadRepository = timeEntryReadRepository;
        }

        public async Task Handle(TimeEntryAdded notification, CancellationToken cancellationToken)
        {
            await _timeEntryReadRepository.Add(notification.Id, notification.User, notification.When, (int) notification.Type);
        }
        
        public async Task Handle(TimeEntryDeleted notification, CancellationToken cancellationToken)
        {
            await _timeEntryReadRepository.Delete(notification.Id, notification.User);
        }

        public async Task<TimeEntryReadDto> Handle(GetTimeEntryById request, CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableArray<TimeEntryReadDto>> Handle(GetTimeEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.Get(request.Id);
        }
    }
}