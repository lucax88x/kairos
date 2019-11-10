using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Kairos.Domain.Events.TimeEntry.EventDtos;
using Kairos.Infra.Read.UserProfile;

namespace Kairos.Infra.Read.TimeEntry
{
    public interface ITimeEntryReadRepository
    {
        Task AddOrUpdate(TimeEntryEventDto timeEntry);
        Task Delete(Guid id, string? user);
        Task<ImmutableList<TimeEntryAggregationReadDto>> Get(string user, int year);
        Task<TimeEntryAggregationReadDto> GetById(Guid id);
    }

    public class TimeEntryReadRepository : ITimeEntryReadRepository
    {
        private readonly IReadRepository _repository;
        private readonly IUserProfileReadRepository _userProfileReadRepository;

        public TimeEntryReadRepository(ReadRepositoryFactory readRepositoryFactory,
            IUserProfileReadRepository userProfileReadRepository)
        {
            _userProfileReadRepository = userProfileReadRepository;
            _repository = readRepositoryFactory.Build("time-entry");
        }

        public async Task AddOrUpdate(TimeEntryEventDto timeEntry)
        {
            var dto = new TimeEntryReadDto(timeEntry.Id, timeEntry.When, (int) timeEntry.Type, timeEntry.Job);

            await _repository.Set(timeEntry.Id, dto);
            await _repository.SortedSetAdd($"by-when|by-user|{timeEntry.User}", dto.When.UtcTicks, timeEntry.Id);
        }

        public async Task Delete(Guid id, string? user)
        {
            await _repository.SetRemove(id);
            await _repository.SortedSetRemove($"by-when|by-user|{user}", id);
        }

        public async Task<ImmutableList<TimeEntryAggregationReadDto>> Get(string user, int year)
        {
            var ids = await _repository.SortedSetRangeByScore($"by-when|by-user|{user}");

            var dtos = await _repository.GetMultiple<TimeEntryReadDto>(ids);
            
            dtos = dtos
                .Where(d => d.When.Year == year)
                .ToImmutableArray();

            var jobs = await _userProfileReadRepository.GetMultipleJobs(dtos.Select(d => d.Job).Distinct());

            var indexedJobs = jobs.ToDictionary(job => job.Id, job => job);

            return dtos
                .Select(dto => new TimeEntryAggregationReadDto(dto.Id, dto.When, dto.Type, indexedJobs[dto.Job]))
                .OrderByDescending(d => d.When)
                .ToImmutableList();
        }

        public async Task<TimeEntryAggregationReadDto> GetById(Guid id)
        {
            var dto = await _repository.Get<TimeEntryReadDto>(id);
            var job = await _userProfileReadRepository.GetJobById(dto.Job);

            return new TimeEntryAggregationReadDto(dto.Id, dto.When, dto.Type, job);
        }
    }
}