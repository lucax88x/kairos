using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeHolidayEntry.Queries;
using Kairos.Domain.Events.TimeHolidayEntry;
using Kairos.Infra.Read.TimeHolidayEntry;
using MediatR;

namespace Kairos.Application.TimeHolidayEntry
{
    public class TimeHolidayEntryProjection :
        INotificationHandler<TimeHolidayEntryAdded>,
        INotificationHandler<TimeHolidayEntryUpdated>,
        INotificationHandler<TimeHolidayEntryDeleted>,
        IRequestHandler<GetTimeHolidayEntryById, TimeHolidayEntryReadDto>,
        IRequestHandler<GetTimeHolidayEntries, ImmutableArray<TimeHolidayEntryReadDto>>
    {
        private readonly ITimeHolidayEntryReadRepository _timeHolidayEntryReadRepository;

        public TimeHolidayEntryProjection(ITimeHolidayEntryReadRepository timeHolidayEntryReadRepository)
        {
            _timeHolidayEntryReadRepository = timeHolidayEntryReadRepository;
        }

        public async Task Handle(TimeHolidayEntryAdded notification, CancellationToken cancellationToken)
        {
            await _timeHolidayEntryReadRepository.AddOrUpdate(notification.TimeHolidayEntry);
        }
        
        public async Task Handle(TimeHolidayEntryUpdated notification, CancellationToken cancellationToken)
        {
            await _timeHolidayEntryReadRepository.AddOrUpdate(notification.TimeHolidayEntry);
        }

        public async Task Handle(TimeHolidayEntryDeleted notification, CancellationToken cancellationToken)
        {
            await _timeHolidayEntryReadRepository.Delete(notification.Id, notification.User);
        }

        public async Task<TimeHolidayEntryReadDto> Handle(GetTimeHolidayEntryById request,
            CancellationToken cancellationToken)
        {
            return await _timeHolidayEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableArray<TimeHolidayEntryReadDto>> Handle(GetTimeHolidayEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeHolidayEntryReadRepository.Get(request.User, request.Year);
        }
    }
}