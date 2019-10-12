using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Commands
{
    public class DeleteTimeEntries : Command<ImmutableList<Guid>>
    {
        public ImmutableList<Guid> Ids { get; }

        public DeleteTimeEntries(IEnumerable<Guid> ids)
        {
            Ids = ids.ToImmutableList();
        }
    }
}