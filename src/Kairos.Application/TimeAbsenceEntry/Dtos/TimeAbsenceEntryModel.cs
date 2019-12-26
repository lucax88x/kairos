using System;
using Kairos.Domain;
using Kairos.Domain.Events.TimeAbsenceEntry.EventDtos;

namespace Kairos.Application.TimeAbsenceEntry.Dtos
{
    public class TimeAbsenceEntryModel
    {
        public Guid Id { get; set; }
        public string Description { get; set; } = "";
        public DateTimeOffset Start { get; set; }
        public DateTimeOffset End { get; set; }
        public int Type { get; set; }
        public Guid Job { get; set; }

        public TimeAbsenceEntryModel()
        {
        }

        public TimeAbsenceEntryModel(string description, DateTimeOffset start, DateTimeOffset end, int type, Guid job, Guid? id = null)
        {
            Description = description;
            Start = start;
            End = end;
            Type = type;
            Job = job;
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
        }

        public TimeAbsenceEntryEventDto ToEventDto(string? user = null)
        {
            return new TimeAbsenceEntryEventDto(Id,
                user,
                Description,
                Start,
                End,
                (TimeAbsenceEntryType) Type,
                Job);
        }
    }
}