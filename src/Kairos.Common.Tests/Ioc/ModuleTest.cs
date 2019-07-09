using System;
using Kairos.Common.Ioc;
using Kairos.Test.Common;
using Xunit;

namespace Kairos.Common.Tests.Ioc
{
    public class ModuleTest : IDisposable
    {
        private readonly ScopeResolver _scopeResolver;

        public ModuleTest()
        {
            _scopeResolver = new ScopeResolver();

            _scopeResolver.BuildContainer(new Module());
        }

        [Fact]
        public void should_resolve_Serializer()
        {
            _scopeResolver.IsSingleInstance<ISerializer, Serializer>();
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}