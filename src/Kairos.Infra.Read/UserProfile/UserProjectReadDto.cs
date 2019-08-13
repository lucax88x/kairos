using System;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Infra.Read.UserProfile
{
    public class UserProjectReadDto
    {
        public UserProjectReadDto(Guid id, string name, DateTimeOffset start, DateTimeOffset? end, int allocation)
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

        public static UserProjectReadDto From(UserProjectEventDto dto)
        {
            return new UserProjectReadDto(dto.Id, dto.Name, dto.Start, dto.End, dto.Allocation);
        }
    }
}