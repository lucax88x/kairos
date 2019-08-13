using System;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeHolidayEntry.Commands;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;

namespace Kairos.Application.TimeHolidayEntry
{
    public class TimeHolidayEntryService : IRequestHandler<CreateTimeHolidayEntry, Guid>,
        IRequestHandler<DeleteTimeHolidayEntry, Guid>
    {
        private readonly IWriteRepository _writeRepository;
        private readonly IAuthProvider _authProvider;
        private readonly IMediator _mediator;

        public TimeHolidayEntryService(IWriteRepository writeRepository, IMediator mediator, IAuthProvider authProvider)
        {
            _writeRepository = writeRepository;
            _mediator = mediator;
            _authProvider = authProvider;
        }

        public async Task<Guid> Handle(CreateTimeHolidayEntry request, CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeHolidayEntry =
                Domain.TimeHolidayEntry.Create(new TimeHolidayEntryEventDto(request.TimeHolidayEntry.Id, user, request.TimeHolidayEntry.Description, request.TimeHolidayEntry.Start, request.TimeHolidayEntry.End));

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeHolidayEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeHolidayEntry.Id;
        }

        public async Task<Guid> Handle(DeleteTimeHolidayEntry request, CancellationToken cancellationToken)
        {
            var timeHolidayEntry = await _writeRepository.GetOrDefault<Domain.TimeHolidayEntry>(request.Id.ToString());

            timeHolidayEntry.Delete();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeHolidayEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }
    }
}