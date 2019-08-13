using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Application.Ioc;
using Kairos.Application.UserProfile.Commands;
using Kairos.Application.UserProfile.Dtos;
using Kairos.Test.Common.Infra;
using Xunit;

namespace Kairos.Application.Tests.UserProfile
{
    [Trait("Type", "Integration")]
    [Trait("Category", "Database")]
    public class UserProfileTest : IDisposable
    {
        private readonly Sandbox _sandbox;

        public UserProfileTest()
        {
            _sandbox = new Sandbox(new SandboxOptions(true), new Module());
        }

        [Fact]
        public async Task should_create_user_profile()
        {
            // GIVEN
            var command = new CreateOrUpdateUserProfile(new UserProfileModel(new[] {_sandbox.Model.UserJob.Build()}));

            // WHEN           
            var user = await _sandbox.Mediator.Send(command);

            // THEN
            _sandbox.Should.Mediator.Be("CreateOrUpdateUserProfile -> UserProfileAdded");

            await _sandbox.Should.Redis.Exists.Set("user-profile", user);
        }

        [Fact]
        public async Task should_update_user_profile_if_already_exists()
        {
            // GIVEN
            var user = await _sandbox.Scenario.UserProfile.WithEmptyProfile();
            _sandbox.ClearMediator();

            var command = new CreateOrUpdateUserProfile(new UserProfileModel());

            // WHEN           
            await _sandbox.Mediator.Send(command);

            // THEN
            _sandbox.Should.Mediator.Be("CreateOrUpdateUserProfile -> UserProfileUpdated");

            await _sandbox.Should.Redis.Exists.Set("user-profile", user);
        }

        [Fact(Skip = "TODO")]
        public async Task should_not_allow_more_than_100_allocation_on_a_single_day()
        {
            await Task.CompletedTask;
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}