using System;
using Kairos.Common;

namespace Kairos.Application.TimeEntry.Commands
{
    public class DeleteTimeEntry : Command<Guid>
    {
        public Guid Id { get; }

        public DeleteTimeEntry(Guid id)
        {
            Id = id;
        }
    }
}