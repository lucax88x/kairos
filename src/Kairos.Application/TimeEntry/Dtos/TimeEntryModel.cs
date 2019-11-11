using System;
using Kairos.Domain;
using Kairos.Domain.Events.TimeEntry.EventDtos;

namespace Kairos.Application.TimeEntry.Dtos
{
    public class TimeEntryModel
    {
        public Guid Id { get; set; }
        public DateTimeOffset When { get; set; }
        public int Type { get; set; }
        public Guid Job { get; set; }

        public TimeEntryModel()
        {
        }

        public TimeEntryModel(DateTimeOffset when, int type, Guid job, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            When = when;
            Type = type;
            Job = job;
        }

        public TimeEntryEventDto ToEventDto(string? user = null)
        {
            return new TimeEntryEventDto(
                Id,
                user,
                When,
                (TimeEntryType) Type,
                Job
            );
        }
    }
}