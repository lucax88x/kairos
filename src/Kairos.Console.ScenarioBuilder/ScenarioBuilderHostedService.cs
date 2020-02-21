using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using Kairos.Domain;
using MediatR;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Kairos.Console.ScenarioBuilder
{
    public class ScenarioBuilderHostedService : IHostedService
    {
        private readonly ILogger _logger;
        private readonly IMediator _mediator;
        private readonly Guid _trimanJobId = Guid.NewGuid();

        public ScenarioBuilderHostedService(ILogger logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.Information($"Starting Scenario Builder Service.");

            var profile = BuildProfile();
            var timeEntries = BuildTimeEntries();
            var timeAbsenceEntries = BuildTimeAbsenceEntries();

            await _mediator.Send(new CreateOrUpdateUserProfile(profile), cancellationToken);

            await _mediator.Send(new CreateTimeEntries(timeEntries.ToArray()), cancellationToken);
            await _mediator.Send(new CreateTimeAbsenceEntries(timeAbsenceEntries.ToArray()), cancellationToken);

            await Task.CompletedTask;
        }

        private UserProfileModel BuildProfile()
        {
            var profile = new UserProfileModel
            {
                Id = Guid.NewGuid(),
                Jobs = new List<UserJobModel>
                {
                    new UserJobModel
                    {
                        Id = _trimanJobId,
                        Name = "Triman",
                        Start = new DateTimeOffset(new DateTime(2018, 1, 1)),
                        HolidaysPerYear = 20,
                        Monday = 8.50m,
                        Tuesday = 8.50m,
                        Wednesday = 8.50m,
                        Thursday = 8.50m,
                        Friday = 8.50m,
                        Saturday = 0,
                        Sunday = 0,
                    }
                }
            };
            return profile;
        }

        private IEnumerable<TimeEntryModel> BuildTimeEntries()
        {
            var csv = File.ReadAllLines("Data/time-entries.csv");

            foreach (var row in csv)
            {
                var cells = row.Split(",");
                yield return new TimeEntryModel(
                    DateTimeOffset.Parse(cells[0]),
                    (int) (TimeEntryType) Enum.Parse(typeof(TimeEntryType), cells[1]),
                    _trimanJobId);
            }
        }
        
        private IEnumerable<TimeAbsenceEntryModel> BuildTimeAbsenceEntries()
        {
            var csv = File.ReadAllLines("Data/time-absence-entries.csv");

            foreach (var row in csv)
            {
                var cells = row.Split(",");

                yield return new TimeAbsenceEntryModel(
                    cells[4],
                    DateTimeOffset.Parse(cells[0]),
                    DateTimeOffset.Parse(cells[1]),
                    (int) (TimeAbsenceEntryType) Enum.Parse(typeof(TimeAbsenceEntryType), cells[2]),
                    _trimanJobId);
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.Information("Stopping Scenario Builder Service");

            await Task.CompletedTask;
        }
    }
}