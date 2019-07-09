using System;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Domain;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryService : IRequestHandler<CreateTimeEntry, Guid>
    {
        private readonly IMediator _mediator;

        public TimeEntryService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<Guid> Handle(CreateTimeEntry request, CancellationToken cancellationToken)
        {
            var trackTime = Domain.TimeEntry.Create(request.Id, request.When, (TimeEntryType)request.Type);

//            var events = await _writeRepository.Save(trackTime);
//
//            foreach(var evt in events) await _mediator.Publish(evt, cancellationToken);

            return trackTime.Id;
        }
    }
}