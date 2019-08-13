using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Common;

namespace Kairos.Domain
{
    public class UserJob : Entity
    {
        public UserJob(string name, DateTimeOffset start, DateTimeOffset? end, decimal holidaysPerYear, decimal monday,
            decimal tuesday, decimal wednesday, decimal thursday, decimal friday, decimal saturday, decimal sunday,
            IEnumerable<UserProject> projects)
        {
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
        public ImmutableList<UserProject> Projects { get; }
    }
}