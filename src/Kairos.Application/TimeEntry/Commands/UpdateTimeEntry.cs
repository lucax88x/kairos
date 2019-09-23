using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Commands
{
    public class UpdateTimeEntry : Command<Guid>
    {
        public UpdateTimeEntry(TimeEntryModel entry)
        {
            Entry = entry;
        }

        public TimeEntryModel Entry { get; }
    }
}