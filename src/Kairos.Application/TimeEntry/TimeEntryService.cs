using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Domain;
using Kairos.Domain.Events.TimeEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryService :
        IRequestHandler<CreateTimeEntries, ImmutableArray<Guid>>,
        IRequestHandler<DeleteTimeEntry, Guid>
    {
        private readonly IWriteRepository _writeRepository;
        private readonly IAuthProvider _authProvider;
        private readonly IMediator _mediator;

        public TimeEntryService(IWriteRepository writeRepository, IMediator mediator, IAuthProvider authProvider)
        {
            _writeRepository = writeRepository;
            _mediator = mediator;
            _authProvider = authProvider;
        }

        public async Task<ImmutableArray<Guid>> Handle(CreateTimeEntries request, CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeEntries = request.Entries.Select(model =>
                Domain.TimeEntry.Create(new TimeEntryEventDto(
                    model.Id,
                    user,
                    model.When,
                    (TimeEntryType) model.Type,
                    model.Job,
                    model.Project))).ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeEntries.Select(te => te.Id).ToImmutableArray();
        }

        public async Task<Guid> Handle(DeleteTimeEntry request, CancellationToken cancellationToken)
        {
            var timeEntry = await _writeRepository.GetOrDefault<Domain.TimeEntry>(request.Id.ToString());

            timeEntry.Delete();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }
    }
}