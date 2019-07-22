using System;
using System.Threading.Tasks;
using Kairos.Application.TimeEntry.Commands;
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
            
            return await _mediator.Send(new CreateTimeEntry(DateTimeOffset.Parse(when), (int)type, id));
        }
    }
}