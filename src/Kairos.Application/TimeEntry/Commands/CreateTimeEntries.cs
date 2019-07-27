using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Commands
{
    public class CreateTimeEntries : Command<ImmutableArray<Guid>>
    {
        public CreateTimeEntries(params TimeEntryModel[] entries)
        {
            Entries = entries;
        }

        public IEnumerable<TimeEntryModel> Entries { get; }
    }
}