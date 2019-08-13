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
        Task<UserProjectReadDto> GetProjectById(Guid id);
        Task<ImmutableList<UserProjectReadDto>> GetMultipleProjects(IEnumerable<Guid> projectIds);
    }

    public class UserProfileReadRepository : IUserProfileReadRepository
    {
        private readonly IReadRepository _repository;
        private readonly IReadRepository _jobRepository;
        private readonly IReadRepository _projectRepository;

        public UserProfileReadRepository(ReadRepositoryFactory readRepositoryFactory)
        {
            _repository = readRepositoryFactory.Build("user-profile");
            _jobRepository = readRepositoryFactory.Build("user-job");
            _projectRepository = readRepositoryFactory.Build("user-project");
        }

        public async Task AddOrUpdate(UserProfileEventDto profile)
        {
            var dto = UserProfileReadDto.From(profile);

            foreach (var job in dto.Jobs)
            {
                await _jobRepository.Set(job.Id, job);

                foreach (var project in job.Projects)
                {
                    await _projectRepository.Set(project.Id, project);
                }
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

        public async Task<UserProjectReadDto> GetProjectById(Guid id)
        {
            return await _projectRepository.Get<UserProjectReadDto>(id);
        }

        public async Task<ImmutableList<UserProjectReadDto>> GetMultipleProjects(IEnumerable<Guid> projectIds)
        {
            var result = await _projectRepository.GetMultiple<UserProjectReadDto>(projectIds);
            return result.ToImmutableList();
        }
    }
}