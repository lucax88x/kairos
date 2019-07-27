using GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Outputs;

namespace Kairos.Web.Api.GraphQL.Types
{
    public class CreateOrUpdateOutputsType : ObjectGraphType<CreateOrUpdateOutputs>
    {
        public CreateOrUpdateOutputsType()
        {
            Name = nameof(CreateOrUpdateOutputs);
            Field(x => x.Ids, type: typeof(ListGraphType<IdGraphType>));
        }
    }
}