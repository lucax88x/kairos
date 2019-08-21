using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Domain;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeAbsenceEntry
{
    public class TimeAbsenceEntryService : IRequestHandler<CreateTimeAbsenceEntries, ImmutableArray<Guid>>,
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

        public async Task<ImmutableArray<Guid>> Handle(CreateTimeAbsenceEntries request,
            CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeAbsenceEntries = request.TimeAbsenceEntries.Select(model => Domain.TimeAbsenceEntry.Create(
                    new TimeAbsenceEntryEventDto(model.Id, user, model.Description,
                        model.Start,
                        model.End,
                        (TimeAbsenceEntryType) model.Type)))
                .ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeAbsenceEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeAbsenceEntries.Select(te => te.Id).ToImmutableArray();
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