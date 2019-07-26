using System;
using Kairos.Common;
using Kairos.Domain.Events.TimeAbsenceEntry;

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
        public DateTimeOffset When { get; private set; }

        public int Minutes { get; private set; }
        public TimeAbsenceEntryType Type { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TimeAbsenceEntryAdded added:
                {
                    Id = added.Id;
                    User = added.User;
                    Minutes = added.Minutes;
                    When = added.When;
                    Type = added.Type;
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

        public static TimeAbsenceEntry Create(Guid id, string user, DateTimeOffset when, int minutes,
            TimeAbsenceEntryType type)
        {
            var instance = new TimeAbsenceEntry();

            instance.ApplyChange(new TimeAbsenceEntryAdded(id, user, when, minutes, type));

            return instance;
        }
    }
}