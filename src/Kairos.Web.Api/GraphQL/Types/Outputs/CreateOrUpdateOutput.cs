using System;

namespace Kairos.Web.Api.GraphQL.Types.Outputs
{
    public class CreateOrUpdateOutput
    {
        public Guid Id { get; }

        public CreateOrUpdateOutput(Guid id)
        {
            Id = id;
        }
    }
}