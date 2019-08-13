using System;

namespace Kairos.Domain.Events.UserProfile.EventDtos
{
    public class UserProjectEventDto
    {
        public UserProjectEventDto(Guid id, string name, DateTimeOffset start, DateTimeOffset? end, int allocation)
        {
            Id = id;
            Name = name;
            Start = start;
            End = end;
            Allocation = allocation;
        }

        public Guid Id { get; }
        public string Name { get; }
        public DateTimeOffset Start { get; }
        public DateTimeOffset? End { get; }
        public int Allocation { get; }

        public static UserProject To(UserProjectEventDto dto)
        {
            return new UserProject(dto.Name, dto.Start, dto.End, dto.Allocation);
        }
    }
}