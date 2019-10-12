using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Common;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class DeleteTimeAbsenceEntries : Command<ImmutableList<Guid>>
    {
        public ImmutableList<Guid> Ids { get; }

        public DeleteTimeAbsenceEntries(IEnumerable<Guid> ids)
        {
            Ids = ids.ToImmutableList();
        }
    }
}