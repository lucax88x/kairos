using System;
using GraphQL.Types;
using Kairos.Application.TimeAbsenceEntry.Commands;
using Kairos.Application.TimeEntry.Commands;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types.Inputs;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types.Inputs;
using Kairos.Web.Api.GraphQL.Types;
using Kairos.Web.Api.GraphQL.Types.Outputs;
using MediatR;

namespace Kairos.Web.Api.GraphQL
{
    public class KairosMutation : ObjectGraphType
    {
        private readonly IMediator _mediator;

        public KairosMutation(IMediator mediator)
        {
            _mediator = mediator;
            Name = nameof(KairosMutation);

            SetTimeEntry();
            SetTimeAbsenceEntry();
        }

        private void SetTimeEntry()
        {
            FieldAsync<CreateOrUpdateType>(
                "createTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeEntryInputType>> {Name = "timeEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeEntryInput>("timeEntry");
                    var id = await _mediator.Send(new CreateTimeEntry(input.When, input.Type, input.Id));
                    return new CreateOrUpdateOutput(id);
                });

            FieldAsync<CreateOrUpdateType>(
                "deleteTimeEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<Guid>("id");
                    var id = await _mediator.Send(new DeleteTimeEntry(input));
                    return new CreateOrUpdateOutput(id);
                });
        }

        private void SetTimeAbsenceEntry()
        {
            FieldAsync<CreateOrUpdateType>(
                "createTimeAbsenceEntry",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<TimeAbsenceEntryInputType>> {Name = "timeAbsenceEntry"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<TimeAbsenceEntryInput>("timeAbsenceEntry");
                    var id = await _mediator.Send(
                        new CreateTimeAbsenceEntry(input.When, input.Minutes, input.Type, input.Id));
                    return new CreateOrUpdateOutput(id);
                });

            FieldAsync<CreateOrUpdateType>(
                "deleteTimeAbsenceEntry",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: async context =>
                {
                    var input = context.GetArgument<Guid>("id");
                    var id = await _mediator.Send(new DeleteTimeAbsenceEntry(input));
                    return new CreateOrUpdateOutput(id);
                });
        }
    }
}