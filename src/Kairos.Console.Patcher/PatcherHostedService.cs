using System;
using System.Collections;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Application.UserProfile.Queries;
using Kairos.Infra.Read;
using Kairos.Infra.Read.TimeAbsenceEntry;
using Kairos.Infra.Read.UserProfile;
using MediatR;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Kairos.Console.Patcher
{
    public class PatcherHostedService : IHostedService
    {
        private readonly ILogger _logger;
        private readonly IMediator _mediator;
        private readonly IUserProfileReadRepository _userProfileRepository;
        private readonly IReadRepository _timeAbsenceEntryReadRepository;

        public PatcherHostedService(ILogger logger, IMediator mediator,
            IUserProfileReadRepository userProfileRepository,
            ReadRepositoryFactory readRepositoryFactory)
        {
            _logger = logger;
            _mediator = mediator;
            _userProfileRepository = userProfileRepository;
            _timeAbsenceEntryReadRepository = readRepositoryFactory.Build("time-absence-entry");
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.Information($"Starting Patcher Service.");

            var users = await _userProfileRepository.GetUsernames();
            foreach (var user in users)
            {
                var userProfile = await _userProfileRepository.GetByUser(user);

                if (!userProfile.Jobs.Any())
                {
                    _logger.Information($"Skipped {userProfile.User}");
                    continue;
                }

                var job = userProfile.Jobs.First();
                
                var absenceIds = await _timeAbsenceEntryReadRepository.SortedSetRangeByScore($"by-when|by-user|{user}");
                var absences = await _timeAbsenceEntryReadRepository.GetMultiple<TimeAbsenceEntryReadDto>(absenceIds);
                
                foreach (var absence in absences)
                {
                    await _mediator.Send(new UpdateTimeAbsenceEntry(new TimeAbsenceEntryModel(absence.Description,
                        absence.Start, absence.End, absence.Type, job.Id, absence.Id)), cancellationToken);
                }
                
                _logger.Information($"Updated {absences.Length} for {userProfile.User}");
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.Information("Stopping Patcher Service");

            await Task.CompletedTask;
        }
    }
}