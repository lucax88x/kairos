using System;
using FluentValidation;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Common;
using Kairos.Domain;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class CreateTimeAbsenceEntry : Command<Guid>
    {
        public CreateTimeAbsenceEntry(TimeAbsenceEntryModel timeAbsenceEntry)
        {
            TimeAbsenceEntry = timeAbsenceEntry;
        }

        public TimeAbsenceEntryModel TimeAbsenceEntry { get; }
    }

    public class CreateTimeAbsenceEntryValidator : AbstractValidator<CreateTimeAbsenceEntry>
    {
        public CreateTimeAbsenceEntryValidator()
        {
            RuleFor(item => item.TimeAbsenceEntry.Type).Must(BeValidType).WithMessage("Please specify a valid type");
        }

        private bool BeValidType(int type)
        {
            return Enum.IsDefined(typeof(TimeAbsenceEntryType), type);
        }
    }
}