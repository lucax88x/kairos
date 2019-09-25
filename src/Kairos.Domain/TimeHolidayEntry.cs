using System;
using Kairos.Common;
using Kairos.Domain.Events.TimeHolidayEntry;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;

namespace Kairos.Domain
{
    public class TimeHolidayEntry : AggregateRoot
    {
        public string? User { get; private set; }
        public string? Description { get; private set; }
        public DateTimeOffset When { get; private set; }

        protected override void Apply(Event @event)
        {
            switch (@event)
            {
                case TimeHolidayEntryAdded added:
                {
                    Id = added.TimeHolidayEntry.Id;
                    User = added.TimeHolidayEntry.User;
                    Description = added.TimeHolidayEntry.Description;
                    When = added.TimeHolidayEntry.When;
                    return;
                }
                
                case TimeHolidayEntryUpdated updated:
                {
                    Description = updated.TimeHolidayEntry.Description;
                    When = updated.TimeHolidayEntry.When;
                    return;
                }

                case TimeHolidayEntryDeleted _:
                {
                    IsDeleted = true;
                    return;
                }
            }
        }

        public void Delete()
        {
            ApplyChange(new TimeHolidayEntryDeleted(Id, User));
        }
        
        public void Update(TimeHolidayEntryEventDto eventDto)
        {
            ApplyChange(new TimeHolidayEntryUpdated(eventDto));
        }

        public static TimeHolidayEntry Create(TimeHolidayEntryEventDto timeHolidayEntry)
        {
            var instance = new TimeHolidayEntry();

            instance.ApplyChange(new TimeHolidayEntryAdded(timeHolidayEntry));

            return instance;
        }
    }
}