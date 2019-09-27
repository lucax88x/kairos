using System;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace Kairos.Web.Api.GraphQL
{
    public class KairosSchema : Schema
    {
        public KairosSchema(IServiceProvider resolver)
            : base(resolver)
        {
            Query = resolver.GetService<KairosQuery>();
            Mutation = resolver.GetService<KairosMutation>();
        }
    }
}