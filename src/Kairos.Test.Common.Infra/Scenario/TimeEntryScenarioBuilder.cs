using System;
using System.Linq;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Domain;
using MediatR;

namespace Kairos.Test.Common.Infra.Scenario
{
    public class TimeEntryScenarioBuilder
    {
        private readonly IMediator _mediator;

        public TimeEntryScenarioBuilder(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<Guid> With(string when, TimeEntryType type, Guid? id = null)
        {
            if (!id.HasValue)
            {
                id = Guid.NewGuid();
            }

            var ids = await _mediator.Send(
                new CreateTimeEntries(new TimeEntryModel(
                    DateTimeOffset.Parse(when),
                    (int) type,
                    UserProfileScenarioBuilder.Job1, UserProfileScenarioBuilder.Project1,
                    id)));

            return ids.First();
        }
    }
}