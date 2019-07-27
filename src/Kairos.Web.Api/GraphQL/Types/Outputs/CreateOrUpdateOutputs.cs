using System;
using System.Collections.Generic;

namespace Kairos.Web.Api.GraphQL.Types.Outputs
{
    public class CreateOrUpdateOutputs
    {
        public IEnumerable<Guid> Ids { get; }

        public CreateOrUpdateOutputs(IEnumerable<Guid> ids)
        {
            Ids = ids;
        }
    }
}