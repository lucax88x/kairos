using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using Kairos.Common;
using Kairos.Common.Exceptions.Technical;

namespace Kairos.Infra.Write
{
    public interface IWriteRepository
    {
        Task<ImmutableList<Event>> Save<T>(T aggregate) where T : AggregateRoot;
    }

    public class WriteRepository : IWriteRepository
    {
        private readonly IWriteConnectionFactory _writeConnectionFactory;
        private readonly ISerializer _serializer;

        public WriteRepository(IWriteConnectionFactory writeConnectionFactory, ISerializer serializer)
        {
            _writeConnectionFactory = writeConnectionFactory;
            _serializer = serializer;
        }

        public async Task<ImmutableList<Event>> Save<T>(T aggregate) where T : AggregateRoot
        {
            using (var connection = await _writeConnectionFactory.Connect())
            {
                var events = aggregate.GetUncommittedChanges();

                if (!events.Any()) throw new ConcurrencyException();

                var eventDatas = ToEvents(events);

                await connection.AppendToStreamAsync("test-stream", aggregate.Version, eventDatas);

                aggregate.MarkChangesAsCommitted();

                return events;
            }
        }

        private IEnumerable<EventData> ToEvents(ImmutableList<Event> events)
        {
            foreach (var evt in events)
            {
                yield return new EventData(
                    Guid.NewGuid(),
                    nameof(evt),
                    true,
                    Encoding.UTF8.GetBytes(_serializer.Serialize(evt)),
                    Encoding.UTF8.GetBytes(""));
            }
        }
    }
}