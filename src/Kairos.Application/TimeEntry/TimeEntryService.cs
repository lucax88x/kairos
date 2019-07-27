using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Domain;
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
                Domain.TimeEntry.Create(model.Id, user, model.When, (TimeEntryType) model.Type)).ToArray();

            var events = await _writeRepository.Save(timeEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeEntries.Select(te => te.Id).ToImmutableArray();
        }

        public async Task<Guid> Handle(DeleteTimeEntry request, CancellationToken cancellationToken)
        {
            var timeEntry = await _writeRepository.Get<Domain.TimeEntry>(request.Id);

            timeEntry.Delete();

            var events = await _writeRepository.Save(timeEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }
    }
}