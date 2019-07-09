using System;
using FluentAssertions;
using Kairos.Config.Ioc;
using Kairos.Test.Common;
using Xunit;

namespace Kairos.Config.Tests.Ioc
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
                }));
        }

        [Fact]
        public void should_resolve_WriteRepositoryConfig()
        {
            _scopeResolver.IsSingleInstance<WriteRepositoryConfig>();
            var resolved = _scopeResolver.Resolve<WriteRepositoryConfig>();
            resolved.ConnectionString.Should().Be("ConnectTo=tcp://admin:changeit@localhost:1113; HeartBeatTimeout=500");
        }

        [Fact]
        public void should_resolve_ReadRepositoryConfig()
        {
            _scopeResolver.IsSingleInstance<ReadRepositoryConfig>();
            var resolved = _scopeResolver.Resolve<ReadRepositoryConfig>();
            resolved.Endpoints.Should().ContainInOrder("localhost");
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}