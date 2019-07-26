using System;
using Kairos.Common;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class DeleteTimeAbsenceEntry : Command<Guid>
    {
        public Guid Id { get; }

        public DeleteTimeAbsenceEntry(Guid id)
        {
            Id = id;
        }
    }
}