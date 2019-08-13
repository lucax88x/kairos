using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using MediatR;

namespace Kairos.Test.Common.Infra.Scenario
{
    public class UserProfileScenarioBuilder
    {
        private readonly IMediator _mediator;
        public static readonly Guid Job1 = new Guid("45870add-326d-4b5c-9e99-c47f8bf01876");
        public static readonly Guid Project1 = new Guid("fb8f34ee-abe7-4057-91cb-e9857dfb1a0e");
        public static readonly Guid Project2 = new Guid("619eb835-2559-42ad-a9a9-0bf7120cf9bf");
        public static readonly Guid Project3 = new Guid("52a0a7cb-95ce-4061-a2ce-e96ed0316510");


        public UserProfileScenarioBuilder(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<string> WithEmptyProfile()
        {
            return await _mediator.Send(new CreateOrUpdateUserProfile(new UserProfileModel()));
        }

        public async Task<string> WithProfile()
        {
            return await _mediator.Send(new CreateOrUpdateUserProfile(new UserProfileModel
            {
                Jobs = new List<UserJobModel>
                {
                    new UserJobModel
                    {
                        Id = Job1,
                        Name = "Job1",
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
                                Id = Project1,
                                Name = "Project1",
                                Allocation = 100,
                                Start = new DateTimeOffset(new DateTime(2018, 1, 1)),
                                End = new DateTimeOffset(new DateTime(2019, 4, 30)),
                            },
                            new UserProjectModel
                            {
                                Id = Project2,
                                Name = "Project2",
                                Allocation = 50,
                                Start = new DateTimeOffset(new DateTime(2019, 5, 1)),
                            },
                            new UserProjectModel
                            {
                                Id = Project3,
                                Name = "Project3",
                                Allocation = 50,
                                Start = new DateTimeOffset(new DateTime(2019, 5, 1)),
                            },
                        }
                    },
                }
            }));
        }
    }
}