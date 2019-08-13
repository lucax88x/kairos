using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace Kairos.Application.UserProfile.Dtos
{
    public class UserProfileModel
    {
        public Guid Id { get; set; }
        public IEnumerable<UserJobModel> Jobs { get; set; }

        public UserProfileModel()
        {
        }

        public UserProfileModel(IEnumerable<UserJobModel> jobs = null, Guid? id = null)
        {
            Id = !id.HasValue || id.Value == Guid.Empty ? Guid.NewGuid() : id.Value;
            Jobs = jobs ?? new List<UserJobModel>();
        }
    }
}