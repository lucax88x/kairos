using System;
using Kairos.Config.Ioc;
using Kairos.Infra.Read;
using Kairos.Test.Common;
using Xunit;

namespace Kairos.Infra.Write.Tests.Ioc
{
    public class ModuleTest : IDisposable
    {
        private readonly ScopeResolver _scopeResolver;

        public ModuleTest()
        {
            _scopeResolver = new ScopeResolver();

            var configBuilder = new ConfigBuilder();

            _scopeResolver.BuildContainer(
                new Config.Ioc.Module(configBuilder.Build(), new ModuleOptions {HasWriteRepository = true}),
                new Infra.Write.Ioc.Module());
        }

        [Fact]
        public void should_resolve_IWriteConnectionFactory()
        {
            _scopeResolver.IsSingleInstance<IWriteConnectionFactory, WriteConnectionFactory>();
        }
        
        [Fact]
        public void should_resolve_IWriteRepository()
        {
            _scopeResolver.IsSingleInstance<IWriteRepository, WriteRepository>();
        }
        
        [Fact]
        public void should_resolve_IWriteSchemaBuilder()
        {
            _scopeResolver.IsSingleInstance<IWriteSchemaBuilder, WriteSchemaBuilder>();
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}