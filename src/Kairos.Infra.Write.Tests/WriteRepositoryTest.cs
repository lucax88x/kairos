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
        public async Task should_successfully_create_a_aggregate_root()
        {
            // GIVEN
            var obj = TestDomainObject.Create();

            obj.Increase();

            // WHEN            
            var events = await _sut.Save(WriteRepository.DefaultKeyTaker, obj);

            // THEN
            events.Should().HaveCount(2);
        }

        [Fact]
        public async Task should_successfully_read_an_aggregate_root()
        {
            // GIVEN
            var obj = TestDomainObject.Create();
            obj.Increase();
            obj.Increase();
            obj.Increase();
            await _sut.Save(WriteRepository.DefaultKeyTaker, obj);

            // WHEN          
            var loaded = await _sut.GetOrDefault<TestDomainObject>(obj.Id.ToString());

            // THEN
            loaded!.Counter.Should().Be(3);
        }

        [Fact]
        public async Task should_successfully_update_an_aggregate_root()
        {
            // GIVEN
            var obj = TestDomainObject.Create();
            obj.Increase();
            await _sut.Save(WriteRepository.DefaultKeyTaker, obj);

            var loaded = await _sut.GetOrDefault<TestDomainObject>(obj.Id.ToString());
            loaded!.Increase();

            // WHEN          
            var events = await _sut.Save(WriteRepository.DefaultKeyTaker, loaded);

            // THEN
            events.Should().HaveCount(1);
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}