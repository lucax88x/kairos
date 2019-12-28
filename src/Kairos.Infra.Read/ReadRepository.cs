using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kairos.Common;
using Kairos.Common.Exceptions.Technical;
using StackExchange.Redis;
using StackExchange.Redis.KeyspaceIsolation;

namespace Kairos.Infra.Read
{
    public interface IReadRepository
    {
        Task Set<T>(Guid id, T obj);
        Task Set<T>(string key, T obj);

        Task SetRemove(Guid id);
        Task SetRemove(string key);

        Task<bool> Exists(Guid id);
        Task<bool> Exists(string key);

        Task<T> Get<T>(Guid id);
        Task<T> Get<T>(string key);

        Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<Guid> ids);

        Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<string> ids);

        Task SortedSetAdd(string key, double score, Guid id);
        Task SortedSetAdd(string key, double score, string id);

        Task SortedSetRemove(string key, Guid id);
        Task SortedSetRemove(string key, string id);

        Task<ImmutableArray<string?>> SortedSetRangeByScore(string key,
            double start = double.NegativeInfinity,
            double stop = double.PositiveInfinity,
            Exclude exclude = Exclude.None,
            Order order = Order.Ascending,
            long skip = 0,
            long take = -1);

        Task<ImmutableArray<string>> GetKeys();
    }

    public class ReadRepository : IReadRepository
    {
        private readonly ISerializer _serializer;
        private readonly string _prefix;
        private readonly IDatabase _database;

        public ReadRepository(IConnectionMultiplexer connection, ISerializer serializer, int database, string prefix)
        {
            _serializer = serializer;
            _prefix = prefix;

            _database = connection.GetDatabase(database).WithKeyPrefix(prefix);
        }

        public async Task Set<T>(Guid id, T obj)
        {
            await Set(id.ToString(), obj);
        }

        public async Task Set<T>(string key, T obj)
        {
            var json = _serializer.Serialize(obj);

            var done = await _database.StringSetAsync(key, json);

            if (!done) throw new NotFoundItemException();
        }

        public async Task SetRemove(Guid id)
        {
            await SetRemove(id.ToString());
        }

        public async Task SetRemove(string key)
        {
            var done = await _database.KeyDeleteAsync(key);

            if (!done) throw new NotFoundItemException();
        }

        public async Task<bool> Exists(Guid id)
        {
            return await Exists(id.ToString());
        }

        public async Task<bool> Exists(string key)
        {
            var value = await _database.StringGetAsync(key);
            return value.HasValue;
        }

        public async Task<T> Get<T>(Guid id)
        {
            return await Get<T>(id.ToString());
        }

        public async Task<T> Get<T>(string key)
        {
            var value = await _database.StringGetAsync(key);

            if (!value.HasValue) throw new NotFoundItemException();

            return _serializer.Deserialize<T>(Encoding.UTF8.GetString((byte[]) value));
        }

        public async Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<Guid> ids
        )
        {
            return await GetMultiple<T>(ids.Select(id => id.ToString()));
        }

        public async Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<string> ids
        )
        {
            var keys = ids.Select(i => (RedisKey) i).ToArray();

            var values = await _database.StringGetAsync(keys);

            var result = values
                .Where(v => !v.IsNull)
                .Select(value => _serializer.Deserialize<T>(Encoding.UTF8.GetString((byte[]) value))).ToList();

            return result.ToImmutableArray();
        }

        public async Task SortedSetAdd(string key, double score, Guid id
        )
        {
            await SortedSetAdd(key, score, id.ToString());
        }

        public async Task SortedSetAdd(string key, double score, string id
        )
        {
            await _database.SortedSetAddAsync(key, id, score);
        }

        public async Task SortedSetRemove(string key, Guid id
        )
        {
            await SortedSetRemove(key, id.ToString());
        }

        public async Task SortedSetRemove(string key, string id
        )
        {
            await _database.SortedSetRemoveAsync(key, id);
        }

        public async Task<ImmutableArray<string?>> SortedSetRangeByScore(string key,
            double start = double.NegativeInfinity,
            double stop = double.PositiveInfinity,
            Exclude exclude = Exclude.None,
            Order order = Order.Ascending,
            long skip = 0,
            long take = -1
        )
        {
            var result =
                await _database.SortedSetRangeByScoreAsync(key, start, stop, exclude, order, skip, take);

            return result.Select(m => m == RedisValue.Null ? default : m.ToString())
                .ToImmutableArray();
        }

        public async Task<ImmutableArray<string>> GetKeys()
        {
            var keys = await _database.ExecuteAsync("KEYS", $"{_prefix}*");

            return ((RedisValue[]) keys).Select(key => key.ToString().Replace(_prefix, string.Empty)).ToImmutableArray();
        }
    }
}