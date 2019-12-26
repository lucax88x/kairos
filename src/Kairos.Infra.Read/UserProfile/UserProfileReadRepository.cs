using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Infra.Read.UserProfile
{
    public interface IUserProfileReadRepository
    {
        Task AddOrUpdate(UserProfileEventDto profile);
        Task<UserProfileReadDto> GetByUser(string user);
        Task<UserJobReadDto> GetJobById(Guid id);
        Task<ImmutableList<UserJobReadDto>> GetMultipleJobs(IEnumerable<Guid> jobIds);
        Task<ImmutableArray<string>> GetUsernames();
    }

    public class UserProfileReadRepository : IUserProfileReadRepository
    {
        private readonly IReadRepository _repository;
        private readonly IReadRepository _jobRepository;

        public UserProfileReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("user-profile");
            _jobRepository = readRepositoryFactory.Build("user-job");
        }

        public async Task AddOrUpdate(UserProfileEventDto profile)
        {
            var dto = UserProfileReadDto.From(profile);

            foreach (var job in dto.Jobs)
            {
                await _jobRepository.Set(job.Id, job);
            }

            await _repository.Set(dto.User, dto);
        }

        public async Task<UserProfileReadDto> GetByUser(string user)
        {
            return await _repository.Get<UserProfileReadDto>(user);
        }

        public async Task<UserJobReadDto> GetJobById(Guid id)
        {
            return await _jobRepository.Get<UserJobReadDto>(id);
        }

        public async Task<ImmutableList<UserJobReadDto>> GetMultipleJobs(IEnumerable<Guid> jobIds)
        {
            var result = await _jobRepository.GetMultiple<UserJobReadDto>(jobIds);
            return result.ToImmutableList();
        }        
        
        public async Task<ImmutableArray<string>> GetUsernames()
        {
            return await _repository.GetKeys();
        }
    }
}