using System;
using Kairos.Application.TimeAbsenceEntry;
using Kairos.Application.TimeEntry;
using Kairos.Application.TimeHolidayEntry;
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
                    HasReadRepository = true,
                }),
                new Application.Ioc.Module());
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
        
        [Fact]
        public void should_resolve_TimeAbsenceEntryService()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeAbsenceEntryService>();
        }

        [Fact]
        public void should_resolve_TimeAbsenceEntryProjection()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeAbsenceEntryProjection>();
        }
        
        [Fact]
        public void should_resolve_TimeHolidayEntryService()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeHolidayEntryService>();
        }

        [Fact]
        public void should_resolve_TimeHolidayEntryProjection()
        {
            _scopeResolver.IsInstancePerLifetimeScope<TimeHolidayEntryProjection>();
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}