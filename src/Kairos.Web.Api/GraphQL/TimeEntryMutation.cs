using System;
using System.Threading.Tasks;
using GraphQL.Types;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Web.Api.GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Inputs;
using Kairos.Web.Api.GraphQL.Types.Outputs;
using MediatR;

namespace Kairos.Web.Api.GraphQL
{
    public class TimeEntryMutation : ObjectGraphType<TimeEntryInput>
    {
        public TimeEntryMutation(IMediator mediator)
        {
            Name = nameof(TimeEntryMutation);

            async Task<CreateOrUpdateOutput> CreateTimeEntry(ResolveFieldContext<TimeEntryInput> context)
            {
                var input = context.GetArgument<TimeEntryInput>("timeEntry");
                var id = await mediator.Send(new CreateTimeEntry(input.When, input.Type, input.Id));
                return new CreateOrUpdateOutput(id);
            }

            Field<CreateOrUpdateType>(
                "createTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeEntryInputType>> {Name = "timeEntry"}
                ),
                resolve: (Func<ResolveFieldContext<TimeEntryInput>, Task<CreateOrUpdateOutput>>) CreateTimeEntry);
            
            async Task<CreateOrUpdateOutput> DeleteTimeEntry(ResolveFieldContext<TimeEntryInput> context)
            {
                var input = context.GetArgument<Guid>("id");
                var id = await mediator.Send(new DeleteTimeEntry(input));
                return new CreateOrUpdateOutput(id);
            }

            Field<CreateOrUpdateType>(
                "deleteTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: (Func<ResolveFieldContext<TimeEntryInput>, Task<CreateOrUpdateOutput>>) DeleteTimeEntry);
        }
    }
}