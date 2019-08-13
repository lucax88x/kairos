using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace Kairos.Domain.Events.UserProfile.EventDtos
{
    public class UserProfileEventDto
    {
        public UserProfileEventDto(Guid id, string user, IEnumerable<UserJobEventDto> jobs)
        {
            Id = id;
            User = user;
            Jobs = jobs == null ? ImmutableList.Create<UserJobEventDto>() : jobs.ToImmutableList();
        }

        public Guid Id { get; }
        public string User { get; }
        public ImmutableList<UserJobEventDto> Jobs { get; }
    }
}