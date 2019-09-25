using System;
using Kairos.Domain.Events.TimeHolidayEntry.EventDtos;

namespace Kairos.Application.TimeHolidayEntry.Dtos
{
    public class TimeHolidayEntryModel
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public DateTimeOffset When { get; set; }

        public TimeHolidayEntryModel()
        {
        }

        public TimeHolidayEntryModel(string? description, DateTimeOffset when, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            Description = description;
            When = when;
        }

        public TimeHolidayEntryEventDto ToEventDto(string? user = null)
        {
            return new TimeHolidayEntryEventDto(
                Id,
                user,
                Description,
                When
            );
        }
    }
}