using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Infra.Read.TimeAbsenceEntry
{
    public interface ITimeAbsenceEntryReadRepository
    {
        Task AddOrUpdate(TimeAbsenceEntryEventDto timeAbsenceEntry);
        Task Delete(Guid id, string? user);

        Task<ImmutableList<TimeAbsenceEntryAggregationReadDto>> Get(string user, DateTimeOffset start,
            DateTimeOffset end);

        Task<TimeAbsenceEntryAggregationReadDto> GetById(Guid id);
    }

    public class TimeAbsenceEntryReadRepository : ITimeAbsenceEntryReadRepository
    {
        private readonly IReadRepository _repository;
        private readonly IUserProfileReadRepository _userProfileReadRepository;

        public TimeAbsenceEntryReadRepository(ReadRepositoryFactory readRepositoryFactory,
            IUserProfileReadRepository userProfileReadRepository)
        {
            _userProfileReadRepository = userProfileReadRepository;
            _repository = readRepositoryFactory.Build("time-absence-entry");
        }

        public async Task AddOrUpdate(TimeAbsenceEntryEventDto timeAbsenceEntry)
        {
            var dto = new TimeAbsenceEntryReadDto(timeAbsenceEntry.Id, timeAbsenceEntry.Description,
                timeAbsenceEntry.Start, timeAbsenceEntry.End, (int) timeAbsenceEntry.Type, timeAbsenceEntry.Job);

            await _repository.Set(timeAbsenceEntry.Id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{timeAbsenceEntry.User}", dto.Start.UtcTicks,
                timeAbsenceEntry.Id);
        }

        public async Task Delete(Guid id, string? user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableList<TimeAbsenceEntryAggregationReadDto>> Get(string user, DateTimeOffset start,
            DateTimeOffset end)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            var dtos = await _repository.GetMultiple<TimeAbsenceEntryReadDto>(ids);

            var jobs = await _userProfileReadRepository.GetMultipleJobs(dtos.Select(d => d.Job).Distinct());

            var indexedJobs = jobs.ToDictionary(job => job.Id, job => job);

            return dtos
                .Where(d => d.Start >= start && d.End <= end)
                .Select(dto => new TimeAbsenceEntryAggregationReadDto(dto.Id, dto.Description, dto.Start, dto.End,
                    dto.Type, indexedJobs[dto.Job]))
                .OrderByDescending(d => d.Start)
                .ToImmutableList();
        }

        public async Task<TimeAbsenceEntryAggregationReadDto> GetById(Guid id)
        {
            var dto = await _repository.Get<TimeAbsenceEntryReadDto>(id);
            var job = await _userProfileReadRepository.GetJobById(dto.Job);

            return new TimeAbsenceEntryAggregationReadDto(dto.Id, dto.Description, dto.Start, dto.End, dto.Type, job);
        }
    }
}