using System;
using FluentValidation;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Common;
using Kairos.Domain;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class CreateTimeAbsenceEntry : Command<Guid>
    {
        public Guid Id { get; }
        public DateTimeOffset When { get; }
        public int Minutes { get; }
        public int Type { get; }

        public CreateTimeAbsenceEntry(DateTimeOffset when, int minutes, int type, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            When = when;
            Minutes = minutes;
            Type = type;
        }
    }

    public class CreateTimeAbsenceEntryValidator : AbstractValidator<CreateTimeAbsenceEntry>
    {
        public CreateTimeAbsenceEntryValidator()
        {
            RuleFor(item => item.Type).Must(BeValidType).WithMessage("Please specify a valid type");
        }

        private bool BeValidType(int type)
        {
            return Enum.IsDefined(typeof(TimeAbsenceEntryType), type);
        }
    }
}