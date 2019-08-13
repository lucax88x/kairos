using System;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Domain;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeAbsenceEntry
{
    public class TimeAbsenceEntryService : IRequestHandler<CreateTimeAbsenceEntry, Guid>,
        IRequestHandler<DeleteTimeAbsenceEntry, Guid>
    {
        private readonly IWriteRepository _writeRepository;
        private readonly IAuthProvider _authProvider;
        private readonly IMediator _mediator;

        public TimeAbsenceEntryService(IWriteRepository writeRepository, IMediator mediator, IAuthProvider authProvider)
        {
            _writeRepository = writeRepository;
            _mediator = mediator;
            _authProvider = authProvider;
        }

        public async Task<Guid> Handle(CreateTimeAbsenceEntry request, CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeAbsenceEntry = Domain.TimeAbsenceEntry.Create(new TimeAbsenceEntryEventDto(request.TimeAbsenceEntry.Id, user, request.TimeAbsenceEntry.Description, request.TimeAbsenceEntry.Start,
                request.TimeAbsenceEntry.End,
                (TimeAbsenceEntryType) request.TimeAbsenceEntry.Type));

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeAbsenceEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeAbsenceEntry.Id;
        }

        public async Task<Guid> Handle(DeleteTimeAbsenceEntry request, CancellationToken cancellationToken)
        {
            var timeAbsenceEntry = await _writeRepository.GetOrDefault<Domain.TimeAbsenceEntry>(request.Id.ToString());

            timeAbsenceEntry.Delete();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeAbsenceEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }
    }
}