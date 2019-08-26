using System;

namespace Kairos.Domain.Events.TimeHolidayEntry.EventDtos
{
    public class TimeHolidayEntryEventDto
    {
        public Guid Id { get; }
        public string User { get; }
        public string Description { get; }
        public DateTimeOffset When { get; }

        public TimeHolidayEntryEventDto(Guid id, string user, string description, DateTimeOffset when)
        {
            Id = id;
            User = user;
            Description = description;
            When = when;
        }
    }
}