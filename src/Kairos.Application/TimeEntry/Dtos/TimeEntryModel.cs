using System;

namespace Kairos.Application.TimeEntry.Dtos
{
    public class TimeEntryModel
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Type { get; }

        public TimeEntryModel(DateTimeOffset when, int type, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            When = when;
            Type = type;
        }
    }
}