using System;
using Kairos.Common;
using Kairos.Domain.Events.TimeEntry;
using Kairos.Domain.Events.TimeEntry.EventDtos;

namespace Kairos.Domain
{
    public enum TimeEntryType
    {
        In = 1,
        Out = -1
    }

    public class TimeEntry : AggregateRoot
    {
        public string? User { get; private set; }
        public DateTimeOffset When { get; private set; }
        public TimeEntryType Type { get; private set; }
        public Guid Job { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TimeEntryAdded added:
                {
                    Id = added.TimeEntry.Id;
                    User = added.TimeEntry.User;
                    When = added.TimeEntry.When;
                    Job = added.TimeEntry.Job;
                    return;
                }

                case TimeEntryUpdated updated:
                {
                    When = updated.TimeEntry.When;
                    Type = updated.TimeEntry.Type;
                    Job = updated.TimeEntry.Job;
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
            ApplyChange(new TimeEntryDeleted(Id, User));
        }

        public void Update(TimeEntryEventDto eventDto)
        {
            ApplyChange(new TimeEntryUpdated(eventDto));
        }

        public static TimeEntry Create(TimeEntryEventDto eventDto)
        {
            var instance = new TimeEntry();

            instance.ApplyChange(new TimeEntryAdded(eventDto));

            return instance;
        }
    }
}