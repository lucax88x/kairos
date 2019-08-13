using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Diagnostics;
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
        Task<ImmutableList<Event>> Save<T>(Func<T, string> keyTaker, params T[] aggregates) where T : AggregateRoot;
        Task<T> GetOrDefault<T>(string key) where T : AggregateRoot, new();
        Task<bool> Exists<T>(string key) where T : AggregateRoot;
    }

    public class WriteRepository : IWriteRepository
    {
        private readonly IWriteConnectionFactory _writeConnectionFactory;
        private readonly IWriteSchemaBuilder _writeSchemaBuilder;
        private readonly ISerializer _serializer;

        public WriteRepository(IWriteConnectionFactory writeConnectionFactory, IWriteSchemaBuilder writeSchemaBuilder,
            ISerializer serializer)
        {
            _writeConnectionFactory = writeConnectionFactory;
            _writeSchemaBuilder = writeSchemaBuilder;
            _serializer = serializer;
        }


        public async Task<ImmutableList<Event>> Save<T>(Func<T, string> keyTaker, params T[] aggregates)
            where T : AggregateRoot
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

                        await connection.AppendToStreamAsync(
                            _writeSchemaBuilder.Build(BuildStreamName<T>(keyTaker(aggregate))),
                            aggregate.Version,
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

        public async Task<bool> Exists<T>(string key) where T : AggregateRoot
        {
            using (var connection = await _writeConnectionFactory.Connect())
            {
                var slice = await connection.ReadStreamEventsForwardAsync(
                    _writeSchemaBuilder.Build(BuildStreamName<T>(key)), 0, 1, false);

                return slice.Status != SliceReadStatus.StreamNotFound;
            }
        }

        public async Task<T> GetOrDefault<T>(string key) where T : AggregateRoot, new()
        {
            using (var connection = await _writeConnectionFactory.Connect())
            {
                var streamEvents = new List<ResolvedEvent>();

                StreamEventsSlice currentSlice;
                long nextSliceStart = StreamPosition.Start;
                do
                {
                    currentSlice =
                        await connection.ReadStreamEventsForwardAsync(
                            _writeSchemaBuilder.Build(BuildStreamName<T>(key)), nextSliceStart, 20,
                            false);

                    nextSliceStart = currentSlice.NextEventNumber;

                    streamEvents.AddRange(currentSlice.Events);
                } while (!currentSlice.IsEndOfStream);

                if (!streamEvents.Any())
                {
                    return null;
                }

                var events = ToEvents(streamEvents);

                var aggregateRoot = new T();

                // TODO: version?
                aggregateRoot.LoadsFromHistory(events, streamEvents.Max(se => se.Event.EventNumber));

                return aggregateRoot;
            }
        }

        private string BuildStreamName<T>(string key) where T : AggregateRoot
        {
            return $"${typeof(T).Name}-${key}";
        }

        private IEnumerable<EventData> ToStreamEvents(IEnumerable<Event> events)
        {
            return events.Select(evt =>
            {
                var eventType = evt.GetType();

                var data = Encoding.UTF8.GetBytes(_serializer.Serialize(evt));

                var metadata = Encoding.UTF8.GetBytes(
                    _serializer.Serialize(new EventMetadata(eventType.AssemblyQualifiedName,
                        1)));

                return new EventData(
                    Guid.NewGuid(),
                    eventType.Name,
                    true,
                    data,
                    metadata);
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

        public static string DefaultKeyTaker<T>(T aggregateRoot) where T : AggregateRoot
        {
            return aggregateRoot.Id.ToString();
        }
    }
}