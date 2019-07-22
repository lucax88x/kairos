using System;
using Kairos.Common;

namespace Kairos.Domain.Events
{
    public class TimeEntryDeleted : Event
    {
        public TimeEntryDeleted(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; }
    }
}