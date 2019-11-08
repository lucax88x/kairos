using System;
using Kairos.Application.UserProfile.Dtos;

namespace Kairos.Test.Common.Infra.Builders
{
    public class UserJobModelBuilder
    {
        public UserJobModel Build()
        {
            return new UserJobModel(Guid.NewGuid(), "job", DateTimeOffset.MinValue, DateTimeOffset.MaxValue,
                20, 8, 8, 8, 8, 8, 8, 8
            );
        }
    }
}