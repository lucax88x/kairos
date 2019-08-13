using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Kairos.Domain.Events.UserProfile.EventDtos;

namespace Kairos.Infra.Read.UserProfile
{
    public class UserProfileReadDto
    {
        public Guid Id { get; }
        public string User { get; }
        public ImmutableList<UserJobReadDto> Jobs { get; }

        public UserProfileReadDto(Guid id, string user, IEnumerable<UserJobReadDto> jobs)
        {
            Id = id;
            User = user;
            Jobs = jobs == null ? ImmutableList.Create<UserJobReadDto>() : jobs.ToImmutableList();
        }

        public static UserProfileReadDto From(UserProfileEventDto profile)
        {
            return new UserProfileReadDto(profile.Id, profile.User, profile.Jobs.Select(UserJobReadDto.From));
        }
    }
}