using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Infra.Read.UserProfile
{
    public class UserJobReadDto
    {
        public UserJobReadDto(Guid id, string name, DateTimeOffset start, DateTimeOffset? end, decimal holidaysPerYear,
            decimal monday, decimal tuesday, decimal wednesday, decimal thursday, decimal friday, decimal saturday, decimal sunday, 
            IEnumerable<UserProjectReadDto> projects)
        {
            Id = id;
            Name = name;
            Start = start;
            End = end;
            HolidaysPerYear = holidaysPerYear;
            Monday = monday;
            Tuesday = tuesday;
            Wednesday = wednesday;
            Thursday = thursday;
            Friday = friday;
            Saturday = saturday;
            Sunday = sunday;
            Projects = projects.ToImmutableList();
        }

        public Guid Id { get; }
        public string Name { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset? End { get; }
        public decimal HolidaysPerYear { get; }
        public decimal Monday { get; }
        public decimal Tuesday { get; }
        public decimal Wednesday { get; }
        public decimal Thursday { get; }
        public decimal Friday { get; }
        public decimal Saturday { get; }
        public decimal Sunday { get; }
        public ImmutableList<UserProjectReadDto> Projects { get; }

        public static UserJobReadDto From(UserJobEventDto dto)
        {
            return new UserJobReadDto(dto.Id, dto.Name, dto.Start, dto.End, dto.HolidaysPerYear, dto.Monday,
                dto.Tuesday,
                dto.Wednesday, dto.Thursday, dto.Friday, dto.Saturday, dto.Sunday, 
                dto.Projects.Select(UserProjectReadDto.From));
        }
    }
}