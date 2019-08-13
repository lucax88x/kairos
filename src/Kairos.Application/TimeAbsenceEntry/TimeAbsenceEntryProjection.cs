using System.Collections.Immutable;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Queries;
using Kairos.Domain.Events.TimeAbsenceEntry;
using Kairos.Infra.Read.TimeAbsenceEntry;
using MediatR;

namespace Kairos.Application.TimeAbsenceEntry
{
    public class TimeAbsenceEntryProjection :
        INotificationHandler<TimeAbsenceEntryAdded>,
        INotificationHandler<TimeAbsenceEntryDeleted>,
        IRequestHandler<GetTimeAbsenceEntryById, TimeAbsenceEntryReadDto>,
        IRequestHandler<GetTimeAbsenceEntries, ImmutableArray<TimeAbsenceEntryReadDto>>
    {
        private readonly ITimeAbsenceEntryReadRepository _timeAbsenceEntryReadRepository;

        public TimeAbsenceEntryProjection(ITimeAbsenceEntryReadRepository timeAbsenceEntryReadRepository)
        {
            _timeAbsenceEntryReadRepository = timeAbsenceEntryReadRepository;
        }

        public async Task Handle(TimeAbsenceEntryAdded notification, CancellationToken cancellationToken)
        {
            await _timeAbsenceEntryReadRepository.AddOrUpdate(notification.TimeAbsenceEntry);
        }

        public async Task Handle(TimeAbsenceEntryDeleted notification, CancellationToken cancellationToken)
        {
            await _timeAbsenceEntryReadRepository.Delete(notification.Id, notification.User);
        }

        public async Task<TimeAbsenceEntryReadDto> Handle(GetTimeAbsenceEntryById request,
            CancellationToken cancellationToken)
        {
            return await _timeAbsenceEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableArray<TimeAbsenceEntryReadDto>> Handle(GetTimeAbsenceEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeAbsenceEntryReadRepository.Get(request.Id);
        }
    }
}