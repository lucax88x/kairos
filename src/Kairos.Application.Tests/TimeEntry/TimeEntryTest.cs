using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Domain;
using Kairos.Infra.Read.TimeEntry;
using Kairos.Test.Common.Infra;
using Xunit;
using FluentValidation;

namespace Kairos.Application.Tests.TimeEntry
{
    [Trait("Type", "Integration")]
    [Trait("Category", "Database")]
    public class TimeEntryTest : IDisposable
    {
        private readonly Sandbox _sandbox;

        public TimeEntryTest()
        {
            _sandbox = new Sandbox(new SandboxOptions(true), new Application.Ioc.Module());
        }

        [Fact]
        public async Task should_not_allow_to_track_with_invalid_type()
        {
            // GIVEN
            var command = new CreateTimeEntry(DateTimeOffset.UtcNow, 0);

            // WHEN           
            Func<Task> action = async () => await _sandbox.Mediator.Send(command);

            // THEN
            await action.Should().ThrowAsync<ValidationException>();
            _sandbox.Should.Mediator.Be("CreateTimeEntry");
        }

        [Fact]
        public async Task should_create_time_entry()
        {
            // GIVEN
            var command = new CreateTimeEntry(DateTimeOffset.UtcNow, (int) TimeEntryType.In);

            // WHEN           
            var id = await _sandbox.Mediator.Send(command);

            // THEN
            _sandbox.Should.Mediator.Be("CreateTimeEntry -> TimeEntryAdded");

            // TODO: check if event store has event
//            await _sandbox.Should.Cassandra.Exists(id);
            await _sandbox.Should.Redis.Exists.Set("time-entry", id);
            await _sandbox.Should.Redis.Exists.SortedSet<TimeEntryReadDto>("time-entry", "by-when", 1);
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}