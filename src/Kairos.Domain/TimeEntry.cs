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
                case TimeEntryAdded added:
                {
                    Id = added.Id;
                    When = added.When;
                    Type = added.Type;
                    return;
                }

                case TimeEntryDeleted _:
                {
                    IsDeleted = true;
                    return;
                }
            }
        }

        public void Delete()
        {
            ApplyChange(new TimeEntryDeleted(Id));
        }

        public static TimeEntry Create(Guid id, DateTimeOffset when, TimeEntryType type)
        {
            var instance = new TimeEntry();

            instance.ApplyChange(new TimeEntryAdded(id, when, type));

            return instance;
        }
    }
}