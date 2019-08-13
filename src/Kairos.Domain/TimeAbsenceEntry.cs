using System;
using Kairos.Common;
using Kairos.Domain.Events.TimeAbsenceEntry;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;

namespace Kairos.Domain
{
    public enum TimeAbsenceEntryType
    {
        Vacation = 1,
        Illness = 2
    }

    public class TimeAbsenceEntry : AggregateRoot
    {
        public string User { get; private set; }
        public string Description { get; private set; }
        public DateTimeOffset Start { get; private set; }

        public DateTimeOffset End { get; private set; }
        public TimeAbsenceEntryType Type { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TimeAbsenceEntryAdded added:
                {
                    Id = added.TimeAbsenceEntry.Id;
                    User = added.TimeAbsenceEntry.User;
                    Description = added.TimeAbsenceEntry.Description;
                    End = added.TimeAbsenceEntry.End;
                    Start = added.TimeAbsenceEntry.Start;
                    Type = added.TimeAbsenceEntry.Type;
                    return;
                }

                case TimeAbsenceEntryDeleted _:
                {
                    IsDeleted = true;
                    return;
                }
            }
        }

        public void Delete()
        {
            ApplyChange(new TimeAbsenceEntryDeleted(Id, User));
        }

        public static TimeAbsenceEntry Create(TimeAbsenceEntryEventDto timeAbsenceEntry)
        {
            var instance = new TimeAbsenceEntry();

            instance.ApplyChange(new TimeAbsenceEntryAdded(timeAbsenceEntry));

            return instance;
        }
    }
}