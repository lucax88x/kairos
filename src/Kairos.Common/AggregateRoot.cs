using System;
using System.Collections.Immutable;

namespace Kairos.Common
{
    public abstract class AggregateRoot
    {
        private ImmutableList<Event> _changes = ImmutableList.Create<Event>();

        public Guid Id { get; protected set; }
        public int Version { get; protected set; } = -1;
        public bool HasChanges => !_changes.IsEmpty;

        public ImmutableList<Event> GetUncommittedChanges()
        {
            return _changes;
        }

        public void MarkChangesAsCommitted()
        {
            if (HasChanges)
            {
                _changes = _changes.Clear();
            }
        }

        public void LoadsFromHistory(ImmutableList<Event> history, int finalVersion)
        {
            foreach (var e in history) ApplyChange(e, false);

            Version = finalVersion;
        }

        protected void ApplyChange(Event @event)
        {
            ApplyChange(@event, true);
        }

        private void ApplyChange(Event @event, bool isNew)
        {
            Apply(@event);
            if (isNew) _changes = _changes.Add(@event);
        }

        protected abstract void Apply(Event @event);
    }
}