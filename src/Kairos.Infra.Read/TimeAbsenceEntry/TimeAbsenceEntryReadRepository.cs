using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public interface ITimeAbsenceEntryReadRepository
    {
        Task AddOrUpdate(TimeAbsenceEntryEventDto timeAbsenceEntry);
        Task Delete(Guid id, string? user);
        Task<ImmutableArray<TimeAbsenceEntryReadDto>> Get(string user, int year);
        Task<TimeAbsenceEntryReadDto> GetById(Guid id);
    }

    public class TimeAbsenceEntryReadRepository : ITimeAbsenceEntryReadRepository
    {
        private readonly IReadRepository _repository;

        public TimeAbsenceEntryReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("time-absence-entry");
        }

        public async Task AddOrUpdate(TimeAbsenceEntryEventDto timeAbsenceEntry)
        {
            var dto = new TimeAbsenceEntryReadDto(timeAbsenceEntry.Id, timeAbsenceEntry.Description,
                timeAbsenceEntry.Start, timeAbsenceEntry.End, (int) timeAbsenceEntry.Type);

            await _repository.Set(timeAbsenceEntry.Id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{timeAbsenceEntry.User}", dto.Start.UtcTicks,
                timeAbsenceEntry.Id);
        }

        public async Task Delete(Guid id, string? user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableArray<TimeAbsenceEntryReadDto>> Get(string user, int year)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            var dtos = await _repository.GetMultiple<TimeAbsenceEntryReadDto>(ids);

            return dtos.Where(d => d.Start.Year == year || d.End.Year == year).ToImmutableArray();
        }

        public async Task<TimeAbsenceEntryReadDto> GetById(Guid id)
        {
            return await _repository.Get<TimeAbsenceEntryReadDto>(id);
        }
    }
}