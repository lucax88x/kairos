using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Kairos.Common.Exceptions.Technical;
using Kairos.Config.Ioc;
using Kairos.Test.Common;
using Kairos.Test.Common.Infra;
using Xunit;
using Module = Kairos.Infra.Read.Ioc.Module;

namespace Kairos.Infra.Read.Tests
{
    public class ReadRepositoryTest : IDisposable
    {
        private readonly Sandbox _sandbox;
        private readonly IReadRepository _sut;

        public ReadRepositoryTest()
        {
            var configBuilder = new ConfigBuilder();

            _sandbox = new Sandbox(
                new SandboxOptions(),
                new Config.Ioc.Module(configBuilder.Build(), new ModuleOptions {HasReadRepository = true}),
                new Module());

            _sut = _sandbox.Resolve<ReadRepositoryFactory>().Build("read");
        }

        [Fact]
        public async Task should_get_not_found_when_no_item_found()
        {
            // WHEN            
            Func<Task> action = async () => await _sut.Get<SampleObject>("not-exists");

            // THEN               
            await action.Should().ThrowAsync<NotFoundItemException>();
        }

        [Fact]
        public async Task should_get_false_when_does_not_exists()
        {
            // WHEN            
            var result = await _sut.Exists("not-exists");

            // THEN               
            result.Should().BeFalse();
        }

        [Fact]
        public async Task should_get_true_when_does_exists()
        {
            // GIVEN            
            await _sut.Set("key", new SampleObject("sample-text"));

            // WHEN            
            var result = await _sut.Exists("key");

            // THEN               
            result.Should().BeTrue();
        }

        [Fact]
        public async Task should_set_value_and_read_value()
        {
            // WHEN            
            await _sut.Set("key", new SampleObject("sample-text"));

            // THEN            
            var obj = await _sut.Get<SampleObject>("key");
            obj.Text.Should().Be("sample-text");
        }

        [Fact]
        public async Task should_add_values_to_sorted_set_and_return_ordered()
        {
            // WHEN            
            await _sut.SortedSetAdd("sorted-set", 1, new SampleObject("sample-text-1"));
            await _sut.SortedSetAdd("sorted-set", 3, new SampleObject("sample-text-3"));
            await _sut.SortedSetAdd("sorted-set", 2, new SampleObject("sample-text-2"));

            // THEN            
            var collection = await _sut.SortedSetRangeByScore<SampleObject>("sorted-set");
            collection
                .Select(s => s.Text)
                .Should().Equal("sample-text-1", "sample-text-2", "sample-text-3");
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}