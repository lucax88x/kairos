using System;
using Kairos.Application.TimeEntry;
using Kairos.Config.Ioc;
using Kairos.Test.Common;
using Xunit;

namespace Kairos.Application.Tests.Ioc
{
    public class ModuleTest : IDisposable
    {
        private readonly ScopeResolver _scopeResolver;

        public ModuleTest()
        {
            _scopeResolver = new ScopeResolver();

            var configBuilder = new ConfigBuilder();

            _scopeResolver.BuildContainer(
                new Module(configBuilder.Build(), new ModuleOptions
                {
                    HasWriteRepository = true,
                }),
                new Kairos.Application.Ioc.Module());
        }

        [Fact]
        public void should_resolve_TimeEntryService()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeEntryService>();
        }

        [Fact]
        public void should_resolve_TimeEntryProjection()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeEntryProjection>();
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}