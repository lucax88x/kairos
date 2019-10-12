using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Common;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class DeleteTimeHolidayEntries : Command<ImmutableList<Guid>>
    {
        public ImmutableList<Guid> Ids { get; }

        public DeleteTimeHolidayEntries(IEnumerable<Guid> ids)
        {
            Ids = ids.ToImmutableList();
        }
    }
}