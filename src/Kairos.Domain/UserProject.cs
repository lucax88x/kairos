using System;
using Kairos.Common;

namespace Kairos.Domain
{
    public class UserProject : Entity
    {
        public UserProject(string? name, DateTimeOffset start, DateTimeOffset? end, int allocation)
        {
            Name = name;
            Start = start;
            End = end;
            Allocation = allocation;
        }

        public string? Name { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset? End { get; }
        public int Allocation { get; }
    }
}