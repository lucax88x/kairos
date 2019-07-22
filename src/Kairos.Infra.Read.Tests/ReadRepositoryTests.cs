using System;
using System.Collections.Generic;
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
    public class ReadRepositoryTests : IDisposable
    {
        private readonly Sandbox _sandbox;
        private readonly IReadRepository _sut;

        public ReadRepositoryTests()
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
        public async Task should_get_multiple_values()
        {
            // GIVEN
            await _sut.Set("id1", new SampleObject("sample-text-1"));
            await _sut.Set("id2", new SampleObject("sample-text-2"));
            await _sut.Set("id3", new SampleObject("sample-text-3"));

            // WHEN
            var collection = await _sut.GetMultiple<SampleObject>(new List<string> {"id1", "id3"});

            collection.Select(obj => obj.Text)
                .Should().Equal("sample-text-1", "sample-text-3");
        }

        [Fact]
        public async Task should_set_remove_value()
        {
            // GIVEN
            await _sut.Set("key", new SampleObject("sample-text"));

            // WHEN   
            await _sut.SetRemove("key");

            // THEN            
            var result = await _sut.Exists("key");
            result.Should().BeFalse();
        }

        [Fact]
        public async Task should_add_values_to_sorted_set_and_return_ordered()
        {
            // WHEN            
            await _sut.SortedSetAdd("sorted-set", 1, "id1");
            await _sut.SortedSetAdd("sorted-set", 3, "id2");
            await _sut.SortedSetAdd("sorted-set", 2, "id3");

            // THEN            
            var collection = await _sut.SortedSetRangeByScore("sorted-set");
            collection
                .Should().Equal("id1", "id3", "id2");
        }

        [Fact]
        public async Task should_remove_values_from_sorted_set_and_return_not_deleted_and_ordered()
        {
            // GIVEN
            await _sut.SortedSetAdd("sorted-set", 1, "id1");
            await _sut.SortedSetAdd("sorted-set", 3, "id2");
            await _sut.SortedSetAdd("sorted-set", 2, "id3");

            // WHEN            
            await _sut.SortedSetRemove("sorted-set", "id2");


            // THEN
            var collection = await _sut.SortedSetRangeByScore("sorted-set");
            collection
                .Should().Equal("id1", "id3");
        }

        public void Dispose()
        {
            _sandbox?.Dispose();
        }
    }
}