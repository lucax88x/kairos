using System;
using FluentValidation;
using Kairos.Common;
using Kairos.Domain;

namespace Kairos.Application.TimeEntry.Commands
{
    public class CreateTimeEntry : Command<Guid>
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Type { get; }

        public CreateTimeEntry(DateTimeOffset when, int type, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            When = when;
            Type = type;
        }
    }

    public class CreateTimeEntryValidator : AbstractValidator<CreateTimeEntry>
    {
        public CreateTimeEntryValidator()
        {
            RuleFor(item => item.Type).Must(BeValidType).WithMessage("Please specify a valid type");
        }

        private bool BeValidType(int type)
        {
            return Enum.IsDefined(typeof(TimeEntryType), type);
        }
    }
}