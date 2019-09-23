using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Domain.Events.TimeEntry;
using Kairos.Infra.Read.TimeEntry;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryProjection :
        INotificationHandler<TimeEntryAdded>,
        INotificationHandler<TimeEntryUpdated>,
        INotificationHandler<TimeEntryDeleted>,
        IRequestHandler<GetTimeEntryById, TimeEntryAggregationReadDto>,
        IRequestHandler<GetTimeEntries, ImmutableList<TimeEntryAggregationReadDto>>
    {
        private readonly ITimeEntryReadRepository _timeEntryReadRepository;

        public TimeEntryProjection(ITimeEntryReadRepository timeEntryReadRepository)
        {
            _timeEntryReadRepository = timeEntryReadRepository;
        }

        public async Task Handle(TimeEntryAdded notification, CancellationToken cancellationToken)
        {
            await _timeEntryReadRepository.AddOrUpdate(notification.TimeEntry);
        }
        
        public async Task Handle(TimeEntryUpdated notification, CancellationToken cancellationToken)
        {
            await _timeEntryReadRepository.AddOrUpdate(notification.TimeEntry);
        }
        
        public async Task Handle(TimeEntryDeleted notification, CancellationToken cancellationToken)
        {
            await _timeEntryReadRepository.Delete(notification.Id, notification.User);
        }

        public async Task<TimeEntryAggregationReadDto> Handle(GetTimeEntryById request, CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableList<TimeEntryAggregationReadDto>> Handle(GetTimeEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.Get(request.User, request.Year);
        }
    }
}