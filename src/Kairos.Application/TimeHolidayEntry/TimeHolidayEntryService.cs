using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeHolidayEntry.Commands;
using Kairos.Common.Exceptions.Technical;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;
using Kairos.Infra.Write;
using MediatR;
using Nager.Date;

namespace Kairos.Application.TimeHolidayEntry
{
    public class TimeHolidayEntryService :
        IRequestHandler<CreateTimeHolidayEntries, ImmutableArray<Guid>>,
        IRequestHandler<DeleteTimeHolidayEntry, Guid>,
        IRequestHandler<UpdateTimeHolidayEntry, Guid>,
        IRequestHandler<UpdateTimeHolidayEntriesByCountry, ImmutableArray<Guid>>
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

        public async Task<ImmutableArray<Guid>> Handle(CreateTimeHolidayEntries request,
            CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

            var timeHolidayEntries = request.TimeHolidayEntries
                .Select(model => Domain.TimeHolidayEntry.Create(model.ToEventDto(user))).ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeHolidayEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeHolidayEntries.Select(te => te.Id).ToImmutableArray();
        }

        public async Task<Guid> Handle(DeleteTimeHolidayEntry request, CancellationToken cancellationToken)
        {
            var toDeleteEntry = await _writeRepository.GetOrDefault<Domain.TimeHolidayEntry>(request.Id.ToString());

            if (toDeleteEntry == null)
            {
                throw new NotFoundItemException();
            }

            toDeleteEntry.Delete();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toDeleteEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return request.Id;
        }

        public async Task<Guid> Handle(UpdateTimeHolidayEntry request, CancellationToken cancellationToken)
        {
            var toUpdateEntry =
                await _writeRepository.GetOrDefault<Domain.TimeHolidayEntry>(request.TimeHolidayEntry.Id.ToString());

            if (toUpdateEntry == null)
            {
                throw new NotFoundItemException();
            }

            toUpdateEntry.Update(request.TimeHolidayEntry.ToEventDto());

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, toUpdateEntry);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return toUpdateEntry.Id;
        }

        public async Task<ImmutableArray<Guid>> Handle(UpdateTimeHolidayEntriesByCountry request,
            CancellationToken cancellationToken)
        {
            var user = _authProvider.GetUser();

//            var toDeleteEntries = await _writeRepository.GetOrDefault<Domain.TimeHolidayEntry>(request.Id.ToString());
//
//            toDeleteEntries.Delete();

            var holidays = DateSystem.GetPublicHoliday(request.Year, request.CountryCode);

            var timeHolidayEntries = holidays.Select(holiday =>
                Domain.TimeHolidayEntry.Create(new TimeHolidayEntryEventDto(
                    Guid.NewGuid(),
                    user,
                    $"{holiday.LocalName} ({holiday.Name})",
                    holiday.Date)
                )).ToArray();

            var events = await _writeRepository.Save(WriteRepository.DefaultKeyTaker, timeHolidayEntries);

            foreach (var evt in events) await _mediator.Publish(evt, cancellationToken);

            return timeHolidayEntries.Select(te => te.Id).ToImmutableArray();
        }
    }
}