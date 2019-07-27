using GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Outputs;

namespace Kairos.Web.Api.GraphQL.Types
{
    public class CreateOrUpdateOutputType : ObjectGraphType<CreateOrUpdateOutput>
    {
        public CreateOrUpdateOutputType()
        {
            Name = nameof(CreateOrUpdateOutput);
            Field(x => x.Id, type: typeof(IdGraphType));
        }
    }
}