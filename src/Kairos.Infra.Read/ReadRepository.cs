using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kairos.Common;
using Kairos.Common.Exceptions.Technical;
using Newtonsoft.Json;
using StackExchange.Redis;
using StackExchange.Redis.KeyspaceIsolation;

namespace Kairos.Infra.Read
{
    public interface IReadRepository
    {
        Task Set<T>(Guid id, T obj, string path = ".", CommandFlags flags = CommandFlags.None);
        Task Set<T>(string key, T obj, string path = ".", CommandFlags flags = CommandFlags.None);

        Task SetRemove(Guid id, string path = ".", CommandFlags flags = CommandFlags.None);
        Task SetRemove(string key, string path = ".", CommandFlags flags = CommandFlags.None);

        Task<bool> Exists(Guid id, string path = ".", CommandFlags flags = CommandFlags.None);
        Task<bool> Exists(string key, string path = ".", CommandFlags flags = CommandFlags.None);

        Task<T> Get<T>(Guid id, string path = ".", CommandFlags flags = CommandFlags.None);
        Task<T> Get<T>(string key, string path = ".", CommandFlags flags = CommandFlags.None);

        Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<Guid> ids, string path = ".",
            CommandFlags flags = CommandFlags.None);

        Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<string> ids, string path = ".",
            CommandFlags flags = CommandFlags.None);

        Task SortedSetAdd(string key, double score, Guid id, CommandFlags flags = CommandFlags.None);
        Task SortedSetAdd(string key, double score, string id, CommandFlags flags = CommandFlags.None);

        Task SortedSetRemove(string key, Guid id, CommandFlags flags = CommandFlags.None);
        Task SortedSetRemove(string key, string id, CommandFlags flags = CommandFlags.None);

        Task<ImmutableArray<string>> SortedSetRangeByScore(string key,
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
        private readonly ISerializer _serializer;
        private readonly string _prefix;
        private readonly IDatabase _database;

        public ReadRepository(IConnectionMultiplexer connection, ISerializer serializer, int database, string prefix)
        {
            _serializer = serializer;
            _prefix = prefix;

            _database = connection.GetDatabase(database).WithKeyPrefix(prefix);
        }

        public async Task Set<T>(Guid id, T obj, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            await Set(id.ToString(), obj, path, flags);
        }

        public async Task Set<T>(string key, T obj, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var json = _serializer.Serialize(obj);

            var value = await _database.ExecuteAsync("JSON.SET", new object[] {WithPrefix(key), path, json}, flags);

            if (value.IsNull) throw new NotFoundItemException();
        }

        public async Task SetRemove(Guid id, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            await SetRemove(id.ToString(), path, flags);
        }

        public async Task SetRemove(string key, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var value = await _database.ExecuteAsync("JSON.DEL", new object[] {WithPrefix(key), path}, flags);

            if (value.IsNull) throw new NotFoundItemException();
        }

        public async Task<bool> Exists(Guid id, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            return await Exists(id.ToString(), path, flags);
        }

        public async Task<bool> Exists(string key, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var value = await _database.ExecuteAsync("JSON.GET", new object[] {WithPrefix(key), path}, flags);

            return !value.IsNull;
        }

        public async Task<T> Get<T>(Guid id, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            return await Get<T>(id.ToString(), path, flags);
        }

        public async Task<T> Get<T>(string key, string path = ".", CommandFlags flags = CommandFlags.None)
        {
            var value = await _database.ExecuteAsync("JSON.GET", new object[] {WithPrefix(key), path}, flags);

            if (value.IsNull) throw new NotFoundItemException();

            return _serializer.Deserialize<T>(Encoding.UTF8.GetString((byte[]) value));
        }

        public async Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<Guid> ids, string path = ".",
            CommandFlags flags = CommandFlags.None)
        {
            return await GetMultiple<T>(ids.Select(id => id.ToString()), path, flags);
        }

        public async Task<ImmutableArray<T>> GetMultiple<T>(IEnumerable<string> ids, string path = ".",
            CommandFlags flags = CommandFlags.None)
        {
            var keys = ids.ToList();

            var parameters = new object[keys.Count + 1];

            for (var i = 0; i < keys.Count; i++)
            {
                parameters[i] = WithPrefix(keys[i]);
            }

            parameters[keys.Count] = path;

            var values = await _database.ExecuteAsync("JSON.MGET", parameters, flags);

            var array = (byte[][]) values;

            var result = array
                .Select(value => _serializer.Deserialize<T>(Encoding.UTF8.GetString(value))).ToList();

            return result.ToImmutableArray();
        }

        public async Task SortedSetAdd(string key, double score, Guid id,
            CommandFlags flags = CommandFlags.None)
        {
            await SortedSetAdd(key, score, id.ToString(), flags);
        }

        public async Task SortedSetAdd(string key, double score, string id,
            CommandFlags flags = CommandFlags.None)
        {
            await _database.SortedSetAddAsync(key, id, score, flags);
        }

        public async Task SortedSetRemove(string key, Guid id,
            CommandFlags flags = CommandFlags.None)
        {
            await SortedSetRemove(key, id.ToString(), flags);
        }

        public async Task SortedSetRemove(string key, string id,
            CommandFlags flags = CommandFlags.None)
        {
            await _database.SortedSetRemoveAsync(key, id, flags);
        }

        public async Task<ImmutableArray<string>> SortedSetRangeByScore(string key,
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

            return result.Select(m => m == RedisValue.Null ? default : m.ToString())
                .ToImmutableArray();
        }

        private string WithPrefix(string key)
        {
            return $"{_prefix}{key}";
        }
    }
}