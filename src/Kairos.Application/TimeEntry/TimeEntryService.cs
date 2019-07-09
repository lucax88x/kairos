using System;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Domain;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryService : IRequestHandler<CreateTimeEntry, Guid>
    {
        private readonly IWriteRepository _writeRepository;
        private readonly IMediator _mediator;

        public TimeEntryService(IWriteRepository writeRepository, IMediator mediator)
        {
            _writeRepository = writeRepository;
            _mediator = mediator;
        }

        public async Task<Guid> Handle(CreateTimeEntry request, CancellationToken cancellationToken)
        {
            var timeEntry = Domain.TimeEntry.Create(request.Id, request.When, (TimeEntryType) request.Type);

            var events = await _writeRepository.Save(timeEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeEntry.Id;
        }
    }
}