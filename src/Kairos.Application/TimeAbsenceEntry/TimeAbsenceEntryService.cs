using System;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Domain;
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

            var timeAbsenceEntry = Domain.TimeAbsenceEntry.Create(request.Id, user, request.When, request.Minutes,
                (TimeAbsenceEntryType) request.Type);

            var events = await _writeRepository.Save(timeAbsenceEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeAbsenceEntry.Id;
        }

        public async Task<Guid> Handle(DeleteTimeAbsenceEntry request, CancellationToken cancellationToken)
        {
            var timeAbsenceEntry = await _writeRepository.Get<Domain.TimeAbsenceEntry>(request.Id);

            timeAbsenceEntry.Delete();

            var events = await _writeRepository.Save(timeAbsenceEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }
    }
}