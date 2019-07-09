using System;
using Kairos.Common;
using Kairos.Domain.Events;

namespace Kairos.Domain
{
    public enum TimeEntryType
    {
        In = 1,
        Out = -1
    }

    public class TimeEntry : AggregateRoot
    {
        public DateTimeOffset When { get; private set; }
        public TimeEntryType Type { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TimeEntryAdded timeTracked:
                {
                    Id = timeTracked.Id;
                    When = timeTracked.When;
                    Type = timeTracked.Type;
                    return;
                }
            }
        }

        public static TimeEntry Create(Guid id, DateTimeOffset when, TimeEntryType type)
        {
            var instance = new TimeEntry();

            instance.ApplyChange(new TimeEntryAdded(id, when, type));

            return instance;
        }
    }
}