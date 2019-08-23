using System;

namespace Kairos.Application.TimeEntry.Dtos
{
    public class TimeEntryModel
    {
        public Guid Id { get; set; }
        public DateTimeOffset When { get; set; }
        public int Type { get; set; }
        public Guid Job { get; set; }
        public Guid Project { get; set; }

        public TimeEntryModel()
        {
        }

        public TimeEntryModel(DateTimeOffset when, int type, Guid job, Guid project, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            When = when;
            Type = type;
            Job = job;
            Project = project;
        }
    }
}