using System;
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
        Task Set<T>(Guid id, T obj, string path = ".", CommandFlags flags = CommandFlags.None);
        Task Set<T>(RedisKey key, T obj, string path = ".", CommandFlags flags = CommandFlags.None);

        Task<bool> Exists(Guid id, string path = ".", CommandFlags flags = CommandFlags.None);
        Task<bool> Exists(RedisKey key, string path = ".", CommandFlags flags = CommandFlags.None);

        Task<T> Get<T>(Guid id, string path = ".", CommandFlags flags = CommandFlags.None);
        Task<T> Get<T>(RedisKey key, string path = ".", CommandFlags flags = CommandFlags.None);

        Task SortedSetAdd<T>(RedisKey key, double score, T obj, CommandFlags flags = CommandFlags.None);

        Task<ImmutableArray<T>> SortedSetRangeByScore<T>(RedisKey key,
            double start = double.NegativeInfinity,
            double stop = double.PositiveInfinity,
            Exclude exclude = Exclude.None,
            Order order = Order.Ascending,
            long skip = 0,
            long take = -1,
            CommandFlags flags = CommandFlags.None);
    }

    public class ReadRepository : IReadRepository
    {
        private readonly IConnectionMultiplexer _connection;
        private readonly ISerializer _serializer;
        private readonly IDatabase _database;
        private readonly string _prefix;

        public ReadRepository(IConnectionMultiplexer connection, ISerializer serializer, int database, string prefix)
        {
            _connection = connection;
            _serializer = serializer;
            _prefix = prefix;

            _database = _connection.GetDatabase(database).WithKeyPrefix(_prefix);
        }

        public async Task Set<T>(Guid id, T obj, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            await Set(id.ToString(), obj, path, flags);
        }

        public async Task Set<T>(RedisKey key, T obj, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var json = _serializer.Serialize(obj);

            var value = await _database.ExecuteAsync("JSON.SET", new object[] {key, path, json}, flags);

            if (value.IsNull) throw new NotFoundItemException();
        }

        public async Task<bool> Exists(Guid id, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            return await Exists(id.ToString(), path, flags);
        }

        public async Task<bool> Exists(RedisKey key, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var value = await _database.ExecuteAsync("JSON.GET", new object[] {key, path}, flags);

            return !value.IsNull;
        }

        public async Task<T> Get<T>(Guid id, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            return await Get<T>(id.ToString(), path, flags);
        }

        public async Task<T> Get<T>(RedisKey key, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var value = await _database.ExecuteAsync("JSON.GET", new object[] {key, path}, flags);

            if (value.IsNull) throw new NotFoundItemException();

            return _serializer.Deserialize<T>(Encoding.UTF8.GetString((byte[]) value));
        }

        public async Task SortedSetAdd<T>(RedisKey key, double score, T obj, CommandFlags flags = CommandFlags.None)
        {
            var json = _serializer.Serialize(obj);

            await _database.SortedSetAddAsync(key, json, score, flags);
        }

        public async Task<ImmutableArray<T>> SortedSetRangeByScore<T>(RedisKey key,
            double start = double.NegativeInfinity,
            double stop = double.PositiveInfinity,
            Exclude exclude = Exclude.None,
            Order order = Order.Ascending,
            long skip = 0,
            long take = -1,
            CommandFlags flags = CommandFlags.None)
        {
            var result =
                await _database.SortedSetRangeByScoreAsync(key, start, stop, exclude, order, skip, take, flags);

            return result.Select(m => m == RedisValue.Null ? default(T) : _serializer.Deserialize<T>(m))
                .ToImmutableArray();
        }
    }
}