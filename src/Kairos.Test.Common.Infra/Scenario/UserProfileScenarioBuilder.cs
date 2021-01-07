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
        public static readonly Guid Job1 = new("45870add-326d-4b5c-9e99-c47f8bf01876");
        public UserProfileScenarioBuilder(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<string?> WithEmptyProfile()
        {
            return await _mediator.Send(new CreateOrUpdateUserProfile(new UserProfileModel()));
        }

        public async Task<string?> WithProfile()
        {
            return await _mediator.Send(new CreateOrUpdateUserProfile(new UserProfileModel
            {
                Jobs = new List<UserJobModel>
                {
                    new()
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
                    },
                }
            }));
        }
    }
}