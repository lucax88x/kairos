using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class CreateTimeAbsenceEntries : Command<ImmutableList<Guid>>
    {
        public CreateTimeAbsenceEntries(params TimeAbsenceEntryModel[] timeAbsenceEntries)
        {
            TimeAbsenceEntries = timeAbsenceEntries;
        }

        public IEnumerable<TimeAbsenceEntryModel> TimeAbsenceEntries { get; }
    }
}