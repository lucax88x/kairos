using GraphQL;
using GraphQL.Types;

namespace Kairos.Web.Api.GraphQL
{
    public class KairosSchema : Schema
    {
        public KairosSchema(IDependencyResolver resolver)
            : base(resolver)
        {
            Query = resolver.Resolve<KairosQuery>();
            Mutation = resolver.Resolve<KairosMutation>();
        }
    }
}