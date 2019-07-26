using System;
using System.Collections.Immutable;
using System.Threading.Tasks;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public interface ITimeAbsenceEntryReadRepository
    {
        Task Add(Guid id, string user, DateTimeOffset when, int minutes, int type);
        Task Delete(Guid id, string user);
        Task<ImmutableArray<TimeAbsenceEntryReadDto>> Get(string user);
        Task<TimeAbsenceEntryReadDto> GetById(Guid id);
    }

    public class TimeAbsenceEntryReadRepository : ITimeAbsenceEntryReadRepository
    {
        private readonly IReadRepository _repository;

        public TimeAbsenceEntryReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("time-absence-entry");
        }

        public async Task Add(Guid id, string user, DateTimeOffset when, int minutes, int type)
        {
            var dto = new TimeAbsenceEntryReadDto(id, when, minutes, type);

            await _repository.Set(id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{user}", dto.When.UtcTicks, id);
        }

        public async Task Delete(Guid id, string user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableArray<TimeAbsenceEntryReadDto>> Get(string user)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            return await _repository.GetMultiple<TimeAbsenceEntryReadDto>(ids);
        }

        public async Task<TimeAbsenceEntryReadDto> GetById(Guid id)
        {
            return await _repository.Get<TimeAbsenceEntryReadDto>(id);
        }
    }
}