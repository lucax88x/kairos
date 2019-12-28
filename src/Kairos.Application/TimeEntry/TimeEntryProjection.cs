using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Domain;
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
        IRequestHandler<GetTimeEntries, ImmutableList<TimeEntryAggregationReadDto>>,
        IRequestHandler<GetTimeEntriesReport, ReportModel>
    {
        private readonly ITimeEntryReadRepository _timeEntryReadRepository;
        private readonly IAuthProvider _authProvider;

        public TimeEntryProjection(ITimeEntryReadRepository timeEntryReadRepository, IAuthProvider authProvider)
        {
            _timeEntryReadRepository = timeEntryReadRepository;
            _authProvider = authProvider;
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

        public async Task<TimeEntryAggregationReadDto> Handle(GetTimeEntryById request,
            CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.GetById(request.Id);
        }

        public async Task<ImmutableList<TimeEntryAggregationReadDto>> Handle(GetTimeEntries request,
            CancellationToken cancellationToken)
        {
            return await _timeEntryReadRepository.Get(_authProvider.GetUser(), request.Start, request.End);
        }

        public async Task<ReportModel> Handle(GetTimeEntriesReport request, CancellationToken cancellationToken)
        {
            var sb = new StringBuilder();

            var entries = await _timeEntryReadRepository.Get(_authProvider.GetUser(), request.From, request.To);

            foreach (var entry in entries)
                sb.AppendLine($"{entry.When:yyyy-MM-ddTHH:mmZ},{((TimeEntryType)entry.Type).ToString()},{entry.Job.Name}");

            var stream = new MemoryStream(Encoding.UTF8.GetBytes(sb.ToString()));

            return new ReportModel(stream, $"export_entries_{request.From}_{request.To}.csv", "text/csv");
        }
    }
}