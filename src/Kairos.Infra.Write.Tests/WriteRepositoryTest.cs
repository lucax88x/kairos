using System;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Config.Ioc;
using Kairos.Infra.Write.Tests.Models;
using Kairos.Test.Common;
using Kairos.Test.Common.Infra;
using Xunit;

namespace Kairos.Infra.Write.Tests
{
    public class WriteRepositoryTest : IDisposable
    {
        private readonly Sandbox _sandbox;
        private readonly IWriteRepository _sut;

        public WriteRepositoryTest()
        {
            _sandbox = new Sandbox(new SandboxOptions());

            _sut = _sandbox.Resolve<IWriteRepository>();
        }

        [Fact]
        public async Task should_get_not_found_when_no_item_found()
        {
            // GIVEN
            var obj = TestDomainObject.Create();

            // WHEN            
            var events = await _sut.Save(obj);

            // THEN
            events.Should().HaveCount(1);
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}