using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using MediatR;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace Kairos.Console.ScenarioBuilder
{
    public class ScenarioBuilderHostedService : IHostedService
    {
        private readonly ILogger _logger;
        private readonly IMediator _mediator;

        public ScenarioBuilderHostedService(ILogger logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.Information($"Starting Scenario Builder Service.");

            var profile = new UserProfileModel
            {
                Id = Guid.NewGuid(),
                Jobs = new List<UserJobModel>
                {
                    new UserJobModel
                    {
                        Id = Guid.NewGuid(),
                        Name = "Aduno",
                        Start = new DateTimeOffset(new DateTime(2017, 8, 1)),
                        End = new DateTimeOffset(new DateTime(2017, 12, 31)),
                        HolidaysPerYear = 20,
                        Monday = 8.24m,
                        Tuesday = 8.24m,
                        Wednesday = 8.24m,
                        Thursday = 8.24m,
                        Friday = 8.24m,
                        Saturday = 0,
                        Sunday = 0,
                        Projects = new List<UserProjectModel>
                        {
                            new UserProjectModel
                            {
                                Id = Guid.NewGuid(),
                                Name = "VisecaOne",
                                Allocation = 100,
                                Start = new DateTimeOffset(new DateTime(2017, 8, 1)),
                                End = new DateTimeOffset(new DateTime(2017, 12, 31)),
                            }
                        }
                    },
                    new UserJobModel
                    {
                        Id = Guid.NewGuid(),
                        Name = "Triman",
                        Start = new DateTimeOffset(new DateTime(2018, 1, 1)),
                        HolidaysPerYear = 20,
                        Monday = 8.30m,
                        Tuesday = 8.30m,
                        Wednesday = 8.30m,
                        Thursday = 8.30m,
                        Friday = 8.30m,
                        Saturday = 0,
                        Sunday = 0,
                        Projects = new List<UserProjectModel>
                        {
                            new UserProjectModel
                            {
                                Id = Guid.NewGuid(),
                                Name = "DAP",
                                Allocation = 100,
                                Start = new DateTimeOffset(new DateTime(2018, 1, 1)),
                                End = new DateTimeOffset(new DateTime(2019, 4, 30)),
                            },
                            new UserProjectModel
                            {
                                Id = Guid.NewGuid(),
                                Name = "DAP - Coach",
                                Allocation = 50,
                                Start = new DateTimeOffset(new DateTime(2019, 5, 1)),
                            },
                            new UserProjectModel
                            {
                                Id = Guid.NewGuid(),
                                Name = "BASF - Solunaut",
                                Allocation = 50,
                                Start = new DateTimeOffset(new DateTime(2019, 5, 1)),
                            },
                        }
                    },
                    new UserJobModel
                    {
                        Id = Guid.NewGuid(),
                        Name = "Personal",
                        Start = new DateTimeOffset(new DateTime(2019, 2, 15)),
                        HolidaysPerYear = 20,
                        Monday = 3m,
                        Tuesday = 3m,
                        Wednesday = 3m,
                        Thursday = 3m,
                        Friday = 3m,
                        Saturday = 0,
                        Sunday = 0,
                        Projects = new List<UserProjectModel>
                        {
                            new UserProjectModel
                            {
                                Id = Guid.NewGuid(),
                                Name = "kairos",
                                Allocation = 100,
                                Start = new DateTimeOffset(new DateTime(2019, 2, 15)),
                            }
                        }
                    }
                }
            };

            await _mediator.Send(new CreateOrUpdateUserProfile(profile), cancellationToken);

            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.Information("Stopping Scenario Builder Service");

            await Task.CompletedTask;
        }
    }
}