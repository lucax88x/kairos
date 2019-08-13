using System;
using Kairos.Common;

namespace Kairos.Application.TimeHolidayEntry.Commands
{
    public class DeleteTimeHolidayEntry : Command<Guid>
    {
        public Guid Id { get; }

        public DeleteTimeHolidayEntry(Guid id)
        {
            Id = id;
        }
    }
}