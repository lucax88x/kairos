using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using FluentValidation;
using Kairos.Application.Ioc;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Domain;
using Kairos.Test.Common.Infra;
using Kairos.Test.Common.Infra.Scenario;
using Xunit;

namespace Kairos.Application.Tests.TimeEntry
{
    [Trait("Type", "Integration")]
    [Trait("Category", "Database")]
    public class TimeEntryTest : IDisposable
    {
        private readonly Sandbox _sandbox;

        public TimeEntryTest()
        {
            _sandbox = new Sandbox(new SandboxOptions(true), new Module());
        }

        [Fact]
        public async Task should_not_allow_to_track_with_invalid_type()
        {
            // GIVEN
            var command =
                new CreateTimeEntries(new TimeEntryModel(DateTimeOffset.UtcNow,
                    0,
                    Guid.NewGuid(),
                    Guid.NewGuid()));

            // WHEN           
            Func<Task> action = async () => await _sandbox.Mediator!.Send(command);

            // THEN
            await action.Should().ThrowAsync<ValidationException>();
            _sandbox.Should!.Mediator!.Be("CreateTimeEntry");
        }

        [Fact]
        public async Task should_create_time_entry()
        {
            // GIVEN
            var command = new CreateTimeEntries(new TimeEntryModel(DateTimeOffset.UtcNow,
                (int) TimeEntryType.In,
                UserProfileScenarioBuilder.Job1,
                UserProfileScenarioBuilder.Project1));

            // WHEN           
            var ids = await _sandbox.Mediator!.Send(command);

            // THEN
            _sandbox.Should!.Mediator!.Be("CreateTimeEntry -> TimeEntryAdded");

            // TODO: check if event store has event
//            await _sandbox.Should!.Cassandra.Exists(id);
            await _sandbox.Should!.Redis!.Exists.Set("time-entry", ids.First());
            await _sandbox.Should!.Redis!.Exists.SortedSet("time-entry", "by-when", 1);
        }

        [Fact]
        public async Task should_delete_time_entry()
        {
            // GIVEN
            await _sandbox.Scenario!.UserProfile.WithProfile();
            var existingId = await _sandbox.Scenario.TimeEntry.With("2019/01/01", TimeEntryType.In);
            _sandbox.ClearMediator();

            var command = new DeleteTimeEntries(new[] {existingId});

            // WHEN           
            await _sandbox.Mediator!.Send(command);

            // THEN
            _sandbox.Should!.Mediator!.Be("DeleteTimeEntry -> TimeEntryDeleted");

            await _sandbox.Should!.Redis!.NotExists.Set("time-entry", existingId);
            await _sandbox.Should!.Redis!.NotExists.SortedSet("time-entry", "by-when");
        }

        [Fact(Skip = "TODO")]
        public async Task should_not_allow_to_create_time_entry_on_inexistent_job_or_project()
        {
            await Task.CompletedTask;
        }

        [Fact(Skip = "TODO")]
        public async Task should_not_allow_to_create_time_entry_on_a_job_or_project_which_are_outside_the_date()
        {
            await Task.CompletedTask;
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}