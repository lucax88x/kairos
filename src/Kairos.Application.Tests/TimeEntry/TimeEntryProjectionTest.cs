using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Application.TimeEntry.Queries;
using Kairos.Test.Common;
using Kairos.Test.Common.Infra;
using Xunit;

namespace Kairos.Application.Tests.TimeEntry
{
    [Trait("Type", "Integration")]
    [Trait("Category", "Redis")]
    public class TimeEntryProjectionTest : IDisposable
    {
        private readonly Sandbox _sandbox;

        public TimeEntryProjectionTest()
        {
            var configBuilder = new ConfigBuilder();

            _sandbox = new Sandbox(new SandboxOptions(true), configBuilder.BuildModule(),
                new Application.Ioc.Module());
        }

        [Fact]
        public async Task should_get_by_id()
        {
            // TODO: start adding a scenario for adding some data
            // TODO: do the same for other queries
            // GIVEN
            var id = Guid.NewGuid();
            var when = DateTimeOffset.UtcNow;

            var query = new GetTimeEntryById(id);

            // WHEN           
            var dto = await _sandbox.Mediator.Send(query);

            // THEN
            _sandbox.Should.Mediator.Be("GetTimeEntryById");

            dto.Id.Should().Be(id);
            dto.When.Should().Equals(when);
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}