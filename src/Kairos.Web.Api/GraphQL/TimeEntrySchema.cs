using GraphQL;
using GraphQL.Types;

namespace Kairos.Web.Api.GraphQL
{
    public class TimeEntrySchema : Schema
    {
        public TimeEntrySchema(IDependencyResolver resolver)
            : base(resolver)
        {
            Query = resolver.Resolve<TimeEntryQuery>();
            Mutation = resolver.Resolve<TimeEntryMutation>();
        }
    }
}