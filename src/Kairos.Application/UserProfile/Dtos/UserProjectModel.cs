using System;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Application.UserProfile.Dtos
{
    public class UserProjectModel
    {
        public UserProjectModel()
        {
        }

        public UserProjectModel(Guid id, string name, DateTimeOffset start, DateTimeOffset? end, int allocation)
        {
            Id = id;
            Name = name;
            Start = start;
            End = end;
            Allocation = allocation;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTimeOffset Start { get; set; }
        public DateTimeOffset? End { get; set; }
        public int Allocation { get; set; }

        public static UserProjectEventDto To(UserProjectModel model)
        {
            return new UserProjectEventDto(model.Id, model.Name, model.Start, model.End, model.Allocation);
        }
    }
}