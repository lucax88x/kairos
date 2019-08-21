using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using FluentValidation;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Common;
using Kairos.Domain;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class CreateTimeAbsenceEntries : Command<ImmutableArray<Guid>>
    {
        public CreateTimeAbsenceEntries(params TimeAbsenceEntryModel[] timeAbsenceEntries)
        {
            TimeAbsenceEntries = timeAbsenceEntries;
        }

        public IEnumerable<TimeAbsenceEntryModel> TimeAbsenceEntries { get; }
    }
}