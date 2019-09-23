using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Common.Exceptions.Technical;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeEntry
{
    public class TimeEntryService :
        IRequestHandler<CreateTimeEntries, ImmutableArray<Guid>>,
        IRequestHandler<UpdateTimeEntry, Guid>,
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

            var timeEntries = request.Entries.Select(model => Domain.TimeEntry.Create(model.ToEventDto(user)))
                .ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeEntries.Select(te => te.Id).ToImmutableArray();
        }

        public async Task<Guid> Handle(DeleteTimeEntry request, CancellationToken cancellationToken)
        {
            var toDeleteEntry = await _writeRepository.GetOrDefault<Domain.TimeEntry>(request.Id.ToString());

            if (toDeleteEntry == null)
            {
                throw new NotFoundItemException();
            }

            toDeleteEntry.Delete();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toDeleteEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }

        public async Task<Guid> Handle(UpdateTimeEntry request, CancellationToken cancellationToken)
        {
            var toUpdateEntry = await _writeRepository.GetOrDefault<Domain.TimeEntry>(request.Entry.Id.ToString());

            if (toUpdateEntry == null)
            {
                throw new NotFoundItemException();
            }

            toUpdateEntry.Update(request.Entry.ToEventDto());

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toUpdateEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return toUpdateEntry.Id;
        }
    }
}