using System;
using System.Collections.Immutable;
using System.Threading.Tasks;

namespace Kairos.Infra.Read.TimeEntry
{
    public interface ITimeEntryReadRepository
    {
        Task Add(Guid id, DateTimeOffset when, int type);
        Task Delete(Guid id);
        Task<ImmutableArray<TimeEntryReadDto>> Get();
        Task<TimeEntryReadDto> GetById(Guid id);
    }

    public class TimeEntryReadRepository : ITimeEntryReadRepository
    {
        private readonly IReadRepository _repository;

        public TimeEntryReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("time-entry");
        }

        public async Task Add(Guid id, DateTimeOffset when, int type)
        {
            var dto = new TimeEntryReadDto(id, when, type);

            await _repository.Set(id, dto);
            await _repository.SortedSetAdd("by-when", dto.When.UtcTicks, id);
        }

        public async Task Delete(Guid id)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove("by-when", id);
        }

        public async Task<ImmutableArray<TimeEntryReadDto>> Get()
        {
            var ids = await _repository.SortedSetRangeByScore("by-when");

            return await _repository.GetMultiple<TimeEntryReadDto>(ids);
        }

        public async Task<TimeEntryReadDto> GetById(Guid id)
        {
            return await _repository.Get<TimeEntryReadDto>(id);
        }
    }
}