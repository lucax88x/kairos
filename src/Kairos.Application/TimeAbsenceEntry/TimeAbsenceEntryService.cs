using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Common.Exceptions.Technical;
using Kairos.Domain;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeAbsenceEntry
{
    public class TimeAbsenceEntryService :
        IRequestHandler<CreateTimeAbsenceEntries, ImmutableList<Guid>>,
        IRequestHandler<UpdateTimeAbsenceEntry, Guid>,
        IRequestHandler<DeleteTimeAbsenceEntries, ImmutableList<Guid>>
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

        public async Task<ImmutableList<Guid>> Handle(CreateTimeAbsenceEntries request,
            CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeAbsenceEntries = request.TimeAbsenceEntries.Select(model => Domain.TimeAbsenceEntry.Create(
                    model.ToEventDto(user)))
                .ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeAbsenceEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeAbsenceEntries.Select(te => te.Id).ToImmutableList();
        }

        public async Task<ImmutableList<Guid>> Handle(DeleteTimeAbsenceEntries request,
            CancellationToken cancellationToken)
        {
            foreach (var id in request.Ids)
            {
                var toDeleteEntry =
                    await _writeRepository.GetOrDefault<Domain.TimeAbsenceEntry>(id.ToString());

                if (toDeleteEntry == null)
                {
                    throw new NotFoundItemException();
                }

                toDeleteEntry.Delete();

                var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toDeleteEntry);

                foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);
            }

            return request.Ids;
        }

        public async Task<Guid> Handle(UpdateTimeAbsenceEntry request, CancellationToken cancellationToken)
        {
            var toUpdateEntry =
                await _writeRepository.GetOrDefault<Domain.TimeAbsenceEntry>(request.TimeAbsenceEntry.Id.ToString());

            if (toUpdateEntry == null)
            {
                throw new NotFoundItemException();
            }

            toUpdateEntry.Update(request.TimeAbsenceEntry.ToEventDto());

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toUpdateEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return toUpdateEntry.Id;
        }
    }
}