using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Queries;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Domain.Events.TimeAbsenceEntry;
using Kairos.Infra.Read.TimeAbsenceEntry;
using MediatR;

namespace Kairos.Application.TimeAbsenceEntry
{
    public class TimeAbsenceEntryProjection :
        INotificationHandler<TimeAbsenceEntryAdded>,
        INotificationHandler<TimeAbsenceEntryUpdated>,
        INotificationHandler<TimeAbsenceEntryDeleted>,
        IRequestHandler<GetTimeAbsenceEntryById, TimeAbsenceEntryAggregationReadDto>,
        IRequestHandler<GetTimeAbsenceEntries, ImmutableList<TimeAbsenceEntryAggregationReadDto>>,
        IRequestHandler<GetTimeAbsenceEntriesReport, ReportModel>
    {
        private readonly ITimeAbsenceEntryReadRepository _timeAbsenceEntryReadRepository;
        private readonly IAuthProvider _authProvider;

        public TimeAbsenceEntryProjection(ITimeAbsenceEntryReadRepository timeAbsenceEntryReadRepository,
            IAuthProvider authProvider)
        {
            _timeAbsenceEntryReadRepository = timeAbsenceEntryReadRepository;
            _authProvider = authProvider;
        }

        public async Task Handle(TimeAbsenceEntryAdded notification, CancellationToken cancellationToken)
        {
            await _timeAbsenceEntryReadRepository.AddOrUpdate(notification.TimeAbsenceEntry);
        }

        public async Task Handle(TimeAbsenceEntryUpdated notification, CancellationToken cancellationToken)
        {
            await _timeAbsenceEntryReadRepository.AddOrUpdate(notification.TimeAbsenceEntry);
        }

        public async Task Handle(TimeAbsenceEntryDeleted notification, CancellationToken cancellationToken)
        {
            await _timeAbsenceEntryReadRepository.Delete(notification.Id, notification.User);
        }

        public async Task<TimeAbsenceEntryAggregationReadDto> Handle(GetTimeAbsenceEntryById request,
            CancellationToken cancellationToken)
        {
            return await _timeAbsenceEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableList<TimeAbsenceEntryAggregationReadDto>> Handle(GetTimeAbsenceEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeAbsenceEntryReadRepository.Get(_authProvider.GetUser(), request.Start, request.End);
        }

        public async Task<ReportModel> Handle(GetTimeAbsenceEntriesReport request, CancellationToken cancellationToken)
        {
            var sb = new StringBuilder();
            var absences = await _timeAbsenceEntryReadRepository.Get(_authProvider.GetUser(), request.From, request.To);

            foreach (var absence in absences)
                sb.AppendLine($"{absence.Start},{absence.End},{absence.Type},{absence.Job.Name},{absence.Description}");

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(sb.ToString()));

            return new ReportModel(stream, $"export_absences_{request.From}_{request.To}.csv", "text/csv");
        }
    }
}