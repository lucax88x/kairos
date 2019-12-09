using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;

namespace Kairos.Infra.Read.TimeHolidayEntry
{
    public interface ITimeHolidayEntryReadRepository
    {
        Task AddOrUpdate(TimeHolidayEntryEventDto timeHolidayEntry);
        Task Delete(Guid id, string? user);
        Task<ImmutableList<TimeHolidayEntryReadDto>> Get(string user, DateTimeOffset start, DateTimeOffset end);
        Task<TimeHolidayEntryReadDto> GetById(Guid id);
    }

    public class TimeHolidayEntryReadRepository : ITimeHolidayEntryReadRepository
    {
        private readonly IReadRepository _repository;

        public TimeHolidayEntryReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("time-holiday-entry");
        }

        public async Task AddOrUpdate(TimeHolidayEntryEventDto timeHolidayEntry)
        {
            var dto = new TimeHolidayEntryReadDto(timeHolidayEntry.Id, timeHolidayEntry.Description,
                timeHolidayEntry.When);

            await _repository.Set(timeHolidayEntry.Id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{timeHolidayEntry.User}", dto.When.UtcTicks,
                timeHolidayEntry.Id);
        }

        public async Task Delete(Guid id, string? user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableList<TimeHolidayEntryReadDto>> Get(string user, DateTimeOffset start,
            DateTimeOffset end)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            var dtos = await _repository.GetMultiple<TimeHolidayEntryReadDto>(ids);

            return dtos.Where(d => d.When >= start && d.When <= end).ToImmutableList();
        }

        public async Task<TimeHolidayEntryReadDto> GetById(Guid id)
        {
            return await _repository.Get<TimeHolidayEntryReadDto>(id);
        }
    }
}