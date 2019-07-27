using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventStore.ClientAPI;
using EventStore.ClientAPI.Exceptions;
using Kairos.Common;
using Kairos.Common.Exceptions.Technical;

namespace Kairos.Infra.Write
{
    public interface IWriteRepository
    {
        Task<ImmutableList<Event>> Save<T>(params T[] aggregates) where T : AggregateRoot;
        Task<T> Get<T>(Guid id) where T : AggregateRoot, new();
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

        
        public async Task<ImmutableList<Event>> Save<T>(params T[] aggregates) where T : AggregateRoot
        {
            try
            {
                using (var connection = await _writeConnectionFactory.Connect())
                {
                    var result = new List<Event>();
                    foreach (var aggregate in aggregates)
                    {
                        var events = aggregate.GetUncommittedChanges();

                        if (!events.Any()) throw new ConcurrencyException();

                        var streamEvents = ToStreamEvents(events);

                        await connection.AppendToStreamAsync(BuildStreamName<T>(aggregate.Id), aggregate.Version,
                            streamEvents);

                        aggregate.MarkChangesAsCommitted();
                        
                        result.AddRange(events);

                    }

                    return result.ToImmutableList();
                }
            }
            catch (WrongExpectedVersionException)
            {
                throw new ConcurrencyException();
            }
        }


        public async Task<T> Get<T>(Guid id) where T : AggregateRoot, new()
        {
            using (var connection = await _writeConnectionFactory.Connect())
            {
                var streamEvents = new List<ResolvedEvent>();

                StreamEventsSlice currentSlice;
                long nextSliceStart = StreamPosition.Start;
                do
                {
                    currentSlice =
                        await connection.ReadStreamEventsForwardAsync(BuildStreamName<T>(id), nextSliceStart, 20,
                            false);

                    nextSliceStart = currentSlice.NextEventNumber;

                    streamEvents.AddRange(currentSlice.Events);
                } while (!currentSlice.IsEndOfStream);

                var events = ToEvents(streamEvents);

                var aggregateRoot = new T();

                // TODO: version?
                aggregateRoot.LoadsFromHistory(events, streamEvents.Max(se => se.Event.EventNumber));

                return aggregateRoot;
            }
        }

        private static string BuildStreamName<T>(Guid id) where T : AggregateRoot
        {
            return $"${typeof(T).Name}-${id}";
        }

        private IEnumerable<EventData> ToStreamEvents(IEnumerable<Event> events)
        {
            return events.Select(evt =>
            {
                var eventType = evt.GetType();

                return new EventData(
                    Guid.NewGuid(),
                    eventType.Name,
                    true,
                    Encoding.UTF8.GetBytes(_serializer.Serialize(evt)),
                    Encoding.UTF8.GetBytes(
                        _serializer.Serialize(new EventMetadata(eventType.AssemblyQualifiedName,
                            1))));
            });
        }

        private IEnumerable<Event> ToEvents(IEnumerable<ResolvedEvent> streamEvents)
        {
            foreach (var streamEvent in streamEvents)
            {
                var metadata =
                    _serializer.Deserialize<EventMetadata>(Encoding.Default.GetString(streamEvent.Event.Metadata));

                var deserialized = _serializer.Deserialize(Type.GetType(metadata.TypeName),
                    Encoding.Default.GetString(streamEvent.Event.Data));

                if (deserialized is Event evt) yield return evt;
            }
        }
    }
}